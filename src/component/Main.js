import './main.css'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Add from './Add'
import MainCalendar from './MainCalender'

export default function Main(){
    const [select, setSelect] = useState('calender')
    const { state } = useLocation();

    return <div className='main'>
        <div className='sideBar'>
            <h1>HaimSun</h1>
            <div className='sideBlock' style={select === 'calender' ? {backgroundColor : 'rgb(48,48,48)', color : 'orangered'} : {}} onClick={()=>{
                setSelect('calender')
            }}>
                Calender
            </div>
            <div className='sideBlock' style={select === 'farm' ? {backgroundColor : 'rgb(48,48,48)', color : 'orangered'} : {}} onClick={()=>{
                setSelect('farm')
            }}>
                Add Farm
            </div>
        </div>
        <div className='mainContent'>
            {select === 'calender' ? <MainCalendar user_id={state.id}></MainCalendar> : <Add select={select} user_id={state.id}></Add>}

        </div>
    </div>
}