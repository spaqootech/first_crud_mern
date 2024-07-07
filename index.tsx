import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import axios from 'axios';

const Index = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editKey, setEditKey] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addOrEditTask = async () => {
    if (task.trim()) {
      try {
        if (editKey !== null) {
          const response = await axios.put(`http://localhost:5000/tasks/${editKey}`, { value: task });
          setTasks(tasks.map(item => (item._id === editKey ? response.data : item)));
          setEditKey(null);
        } else {
          const response = await axios.post('http://localhost:5000/tasks', { value: task });
          setTasks([...tasks, response.data]);
        }
        setTask('');
      } catch (error) {
        console.error('Error adding or editing task:', error);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const editTask = (id, value) => {
    setTask(value);
    setEditKey(id);
  };

  return (
    <View>
      <View style={tw`p-5 flex-row justify-between items-center`}>
        <TextInput 
          placeholder='Enter Todos' 
          style={tw`text-xl flex-1 border p-2`} 
          value={task} 
          onChangeText={setTask} 
        />
        <Pressable style={tw`p-3 bg-gray-700 ml-2`} onPress={addOrEditTask}>
          <Text style={tw`text-white`}>{editKey !== null ? 'Update' : 'Add'} todos</Text>
        </Pressable>
      </View>
      <View style={tw`p-5`}>
        <FlatList 
          data={tasks} 
          renderItem={({ item }) => (
            <View style={tw`flex-row justify-between items-center my-1`} key={item._id}>
              <Text>{item.value}</Text>
              <View style={tw`flex-row`}>
                <Pressable style={tw`p-3 bg-gray-700 ml-2`} onPress={() => editTask(item._id, item.value)}>
                  <Text style={tw`text-white`}>Edit</Text>
                </Pressable>
                <Pressable style={tw`p-3 bg-red-700 ml-2`} onPress={() => deleteTask(item._id)}>
                  <Text style={tw`text-white`}>Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Index;
