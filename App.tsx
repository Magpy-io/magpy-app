import React from 'react';
import { View } from 'react-native';

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Button, Text } from 'react-native-elements';

const todos: string[] = [];

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const newTodos = [...todos];
      await new Promise<void>(res => {
        setTimeout(() => {
          res();
        }, 4000);
      });
      return newTodos;
    },
    refetchInterval: 5000,
  });

  const queryElement = useQuery({
    queryKey: ['todos', 'byIndex'],
    queryFn: async (index: number) => {
      const todo = todos[index];
      await new Promise<void>(res => {
        setTimeout(() => {
          res();
        }, 500);
      });
      return todo;
    },
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: async (s: string) => {
      todos.push(s);
      return s;
    },
    onSuccess: async (s: string) => {
      const newData = [...query.data, s];
      queryClient.setQueryData(['todos'], newData);
    },
  });

  console.log(query.fetchStatus);

  const mutation1 = useMutation({
    mutationFn: async (s: string) => {
      todos.push(s);
    },
    onSuccess: (a, b) => {
      const newData = [...query.data, b];
      queryClient.setQueryData(['todos'], newData);
    },
  });

  return (
    <View>
      <Text>
        {query.data?.reduce((s, n) => {
          return s + '\n' + n;
        }, '')}
      </Text>
      <Button
        title={'Button'}
        onPress={() => {
          mutation.mutate(query.data?.length.toString() ?? 'new');
        }}
      />
      <Button
        title={'Button2'}
        onPress={() => {
          mutation1.mutate('new data');
        }}
      />
    </View>
  );
}

export default App;
