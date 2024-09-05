import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASEURL = 'http://localhost:8000/tasks';
const initialState = {
    tasksList: [],
    selectedTask: {},
    isLoading: false,
    error: ''
}

// GET /tasks
export const getTasksFromServer = createAsyncThunk(
    "tasks/getTasksFromServer",
    async (_, {rejectWithValue})=>{
        const response = await fetch(BASEURL)
        if(response.ok){
            const jsonResponse = await response.json();
            return jsonResponse;
        }else{
            return rejectWithValue({error: 'No Record found!'})
        }
    }
)

// POST /tasks
export const addTasksToServer = createAsyncThunk(
    "tasks/addTasksToServer",
    async (task, {rejectWithValue})=>{
        const options = {
            method: 'POST',
            body: JSON.stringify(task),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        }
        const response = await fetch(BASEURL, options)
        if(response.ok){
            const jsonResponse = await response.json();
            return jsonResponse;
        }else{
            return rejectWithValue({error: 'Task not added!'})
        }
    }
)

// PATCH /tasks
export const updateTasksInServer = createAsyncThunk(
    "tasks/updateTasksInServer",
    async (task, {rejectWithValue})=>{
        const options = {
            method: 'PATCH',
            body: JSON.stringify(task),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        }
        const response = await fetch(BASEURL + '/' + task.id, options)
        if(response.ok){
            const jsonResponse = await response.json();
            return jsonResponse;
        }else{
            return rejectWithValue({error: 'Task not updated!'})
        }
    }
)

// DELETE /tasks
export const deleteTasksInServer = createAsyncThunk(
    "tasks/deleteTasksInServer",
    async (task, {rejectWithValue})=>{
        const options = {
            method: 'DELETE',
        }
        const response = await fetch(BASEURL + '/' + task.id, options)
        if(response.ok){
            const jsonResponse = await response.json();
            return jsonResponse;
        }else{
            return rejectWithValue({error: 'Task not updated!'})
        }
    }
)

const tasksSlice = createSlice({
    name:'tasksSlice',
    initialState,
    reducers: {
        addTaskToList:(state,action) => {
            const id = Math.random() * 100
            let task = {...action.payload,id}
            state.tasksList.push(task)
        },
        removeTaskFromList:(state,action) => {
            state.tasksList = state.tasksList.filter((task) => task.id !== action.payload.id)
        },
        updateTaskInList:(state,action) => {
            state.tasksList = state.tasksList.map((task) => task.id === action.payload.id ? action.payload : task )
        },
        setSelectedTask:(state,action) => {
            state.selectedTask = action.payload
        }

    },
    extraReducers:(builder) =>{
        builder
            .addCase(getTasksFromServer.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getTasksFromServer.fulfilled, (state, action)=>{
                state.isLoading = false
                state.error = ''
                state.tasksList =action.payload
            })
            .addCase(getTasksFromServer.rejected, (state, action)=>{
                state.error = action.payload.error
                state.isLoading = false
                state.tasksList = []
            })

            .addCase(addTasksToServer.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(addTasksToServer.fulfilled, (state, action)=>{
                state.isLoading = false
                state.error = ''
                state.tasksList.push(action.payload)
            })
            .addCase(addTasksToServer.rejected, (state, action)=>{
                state.error = action.payload.error
                state.isLoading = false
                
            })

            .addCase(updateTasksInServer.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(updateTasksInServer.fulfilled, (state, action)=>{
                state.isLoading = false
                state.error = ''
                state.tasksList = state.tasksList.map((task) => task.id === action.payload.id ? action.payload : task )
            })
            .addCase(updateTasksInServer.rejected, (state, action)=>{
                state.error = action.payload.error
                state.isLoading = false
                
            })

            .addCase(deleteTasksInServer.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(deleteTasksInServer.fulfilled, (state, action)=>{
                state.isLoading = false
                state.error = ''
                state.tasksList = state.tasksList.filter((task) => task.id !== action.payload.id)
            })
            .addCase(deleteTasksInServer.rejected, (state, action)=>{
                state.error = action.payload.error
                state.isLoading = false
                
            })
    }

})

export const {addTaskToList,removeTaskFromList,updateTaskInList,setSelectedTask} = tasksSlice.actions

export default tasksSlice.reducer