import { supabase } from '../lib/supabase';

// Función para formatear errores de Supabase
const formatError = (error, context) => {
  console.error(`[Supabase Error] ${context}:`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
    ...(error.details && { details: error.details }),
  });
  return error;
};

export const getPlazas = async () => {
  console.log('[Supabase] Obteniendo plazas...');
  try {
    const { data, error } = await supabase.from('plaza').select('*').order('id');

    if (error) throw formatError(error, 'Error al obtener plazas');

    console.log('[Supabase] Plazas obtenidas:', data);
    return { data };
  } catch (error) {
    console.error('[Supabase] Error en getPlazas:', error);
    throw error;
  }
};

export const postEntrada = async id => {
  console.log(`[Supabase] Registrando entrada para plaza ${id}...`);
  try {
    const { data, error } = await supabase
      .from('tiempo')
      .insert([
        {
          plaza_id: id,
          entrada: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw formatError(error, 'Error al registrar entrada');

    console.log('[Supabase] Entrada registrada:', data);

    // Actualizar el estado de la plaza a ocupado
    const { error: updateError } = await supabase
      .from('plaza')
      .update({ estado: true })
      .eq('id', id);

    if (updateError) throw formatError(updateError, 'Error al actualizar estado de plaza');

    return data;
  } catch (error) {
    console.error('[Supabase] Error en postEntrada:', error);
    throw error;
  }
};

export const postSalida = async id => {
  console.log(`[Supabase] Registrando salida para plaza ${id}...`);
  try {
    // Primero obtenemos el registro de entrada
    const { data: tiempoData, error: tiempoError } = await supabase
      .from('tiempo')
      .select('id, entrada')
      .eq('plaza_id', id)
      .is('salida', null)
      .single();

    if (tiempoError) throw formatError(tiempoError, 'Error al obtener registro de entrada');
    if (!tiempoData) throw new Error('No se encontró registro de entrada activo');

    // Actualizamos solo con la hora de salida
    const { data, error } = await supabase
      .from('tiempo')
      .update({
        salida: new Date().toISOString()
      })
      .eq('id', tiempoData.id)
      .select();

    if (error) throw formatError(error, 'Error al registrar salida');

    console.log('[Supabase] Salida registrada:', data);

    // Actualizar el estado de la plaza a libre
    const { error: updateError } = await supabase
      .from('plaza')
      .update({ estado: false })
      .eq('id', id);

    if (updateError) throw formatError(updateError, 'Error al actualizar estado de plaza');

    return data;
  } catch (error) {
    console.error('[Supabase] Error en postSalida:', error);
    throw error;
  }
};

export const subscribeToPlazas = callback => {
  console.log('[Supabase] Suscribiéndose a cambios en tiempo real...');

  const subscription = supabase
    .channel('plazas_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'plaza',
      },
      payload => {
        console.log('[Supabase] Cambio recibido:', payload);
        callback({
          ...payload,
          eventType: payload.eventType || 'UNKNOWN_EVENT',
        });
      }
    )
    .subscribe((status, err) => {
      if (status === 'CHANNEL_ERROR') {
        console.error('[Supabase] Error en la suscripción:', err);
      } else {
        console.log(`[Supabase] Estado de la suscripción: ${status}`);
      }
    });

  console.log('[Supabase] Suscripción creada');
  return subscription;
};
