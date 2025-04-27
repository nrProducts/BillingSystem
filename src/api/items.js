import { supabase } from '../supabase/client'

export const fetchItems = async () => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    // .order('created', { ascending: false })

  if (error) {
    console.error('Error fetching items:', error.message)
    return []
  }

  return data
}

export const addItem = async (item) => {
  const { data, error } = await supabase.from('items').insert([item]).select()
  if (error) throw error
  return data[0]
}

export const updateItem = async (id, updates) => {
  const { data, error } = await supabase.from('items').update(updates).eq('id', id).select()
  if (error) throw error
  return data[0]
}

export const deleteItem = async (id) => {
  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) throw error
}


