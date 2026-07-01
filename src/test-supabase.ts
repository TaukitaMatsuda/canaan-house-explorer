import { supabase } from './lib/supabase'

export async function testConnection() {
  console.log('🔍 Начинаем тест подключения к Supabase...')
  
  // Тест 1: Получаем все Дома
  const { data: houses, error: housesError } = await supabase
    .from('houses')
    .select('number, name, title')
    .order('number')
  
  if (housesError) {
    console.error('❌ Ошибка загрузки домов:', housesError)
    return
  }
  
  console.log('✅ Дома получены:', houses)
  
  // Тест 2: Получаем персонажей с их Домами (проверка связей)
  const { data: characters, error: charError } = await supabase
    .from('characters')
    .select(`
      name,
      role,
      houses (name, number)
    `)
    .limit(5)
  
  if (charError) {
    console.error('❌ Ошибка загрузки персонажей:', charError)
    return
  }
  
  console.log('✅ Персонажи с Домами:', characters)
  
  // Тест 3: Проверяем события таймлайна
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('name, day, importance')
    .order('day')
    .limit(5)
  
  if (eventsError) {
    console.error('❌ Ошибка загрузки событий:', eventsError)
    return
  }
  
  console.log('✅ События таймлайна:', events)
}