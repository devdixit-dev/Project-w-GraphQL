import { useState } from 'react';
import './App.css';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    getUsers{
     id
     name
     age
     isStudent
    }
  }
`

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id){
     id
     name
     age
     isStudent
    }
  }
`

const CREATE_USER = gql`
  mutation createUser($name: String!, $age: Int!, $isStudent: Boolean!) {
    createUser(name: $name, age: $age, isStudent: $isStudent){
     id
     name
    }
  }
`

const App = () => {

  const [newUser, setNewUser] = useState({});

  const { data: getUsersData, error: getUsersError, loading: getUsersLoading } = useQuery(GET_USERS);

  const { data: getUserByIdData, error: getUserByIdError, loading: getUserByIdLoading } = useQuery(GET_USER_BY_ID,
    { variables: { id: "2" } }
  );

  const [ createUser ] = useMutation(CREATE_USER)

  if (getUsersLoading) return <p>Data loading...</p>

  if (getUsersError) return <p>Error: {error.message}</p>

  const handleCreateUser = async () => {
    console.log(newUser)
    await createUser({
      variables: {
        name: newUser.name, 
        age: Number(newUser.age), 
        isStudent: false
      }
    })
  }

  return (
    <>

      <div>
        <input type="text" placeholder='Name' onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))} />

        <input type="number" placeholder='Age' onChange={(e) => setNewUser((prev) => ({ ...prev, age: e.target.value }))} />

        <button onClick={handleCreateUser}>Create User</button>
      </div>


      <div>
        {getUserByIdLoading
          ? (<h1>Loading chosen user data</h1>)
          : (
            <div>
              <h2>Chosen User: </h2>
              <p>{getUserByIdData.getUserById.name}</p>
              <p>{getUserByIdData.getUserById.age}</p>
            </div>
          )
        }
      </div>

      <h2>Users</h2>
      <div>
        {getUsersData.getUsers.map((user) => (
          <div key={user.id}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Student: {user.isStudent ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default App