import React, { useEffect, useId, useState } from "react";
import fireDb from '../firebase';
import { v4 as uuidv4 } from 'uuid';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Add = ({ currentpath, receiveddate }) => {
    useEffect(() => {
        setStartDate(receiveddate);
    }, [receiveddate]);

    const inputRef1 = React.useRef(null);
    const inputRef2 = React.useRef(null);
    const inputRef3 = React.useRef(null);

    const dateref = React.useRef(null);
    const [startDate, setStartDate] = useState(new Date(receiveddate));
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [category, setCategory] = useState('');
    const [outgoingType,setOutgoingType] = useState('14000');

    function formatDate2(d) {
        var month = d.getMonth();
        var day = d.getDate().toString().padStart(2, '0');
        var year = d.getFullYear();
        year = year.toString().substr(-2);
        month = (month + 1).toString().padStart(2, '0');
        return {
            date: `${day}-${month}${year}`,
            fullyear: d.getFullYear()
        };
    }
    function formatDate(d) {
        var month = d.getMonth();
        var day = d.getDate().toString().padStart(2, '0');
        var year = d.getFullYear();
        year = year.toString().substr(-2);
        month = (month + 1).toString().padStart(2, '0');
        return `${day}-${month}${year}`;
    }
    function getDate(d) {

        return `${d}`;
    }

    let d = new Date();

    const submitDetails = () => {
        let obj = {
            id: uuidv4(),
            date: date || formatDate(dateref.current.props.selected),
            amount: parseInt(amount),
            note,
            category,
            type : outgoingType,
            isImportant: false
        }
        const path = `${currentpath}/_${formatDate2(dateref.current.props.selected).fullyear}/_${obj.date.slice(3)}`;

        //for adding a user
        // let obj = {
        //     username:'',
        //     password:''
        // }
        // const path=``;
        // console.log(obj);
        fireDb.child(path).push(obj);
        setAmount('');
        setNote('');
        setCategory('');
        setDate('');
        setOutgoingType('14000');
        fireDb.child('lastupdate/date/').update({ date: getDate(d) });
    }

    return (
        <div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:'100%'}}>
            <div>
            <DatePicker
            onFocus={(e)=>{e.target.readOnly=true}}
            className='date-picker-wrapper-addEdit'
             ref={dateref} selected={startDate} onChange={(date) => {
                setStartDate(date);
            }} />
            </div>
            {/* <input type='text' 
        placeholder='dd-mmyy date'
        value={date}
        onChange={(e)=>{setDate(e.target.value)}}
        /><br/> */}
        <div>
            <input type='number'
                ref={inputRef1}
                placeholder='enter amount'
                value={amount}
                onClick={() => { inputRef1.current.focus(); }}
                onChange={(e) => {
                    setAmount(e.target.value);
                    inputRef1.current.focus();
                }}
            /><br />
            <input type='text'
                ref={inputRef2}
                placeholder='enter the reason'
                value={note}
                onClick={() => { inputRef2.current.focus(); }}
                onChange={(e) => { setNote(e.target.value); }}
            /><br />
            <input type='text'
                ref={inputRef3}
                placeholder='enter person name or bill type'
                value={category}
                onClick={() => { inputRef3.current.focus(); }}
                onChange={(e) => { setCategory(e.target.value); }}
            /><br />
            <select 
                            onClick={(e) => { e.target.focus() }}
            style={{color:'white',backgroundColor:'#282c34',
        padding:'5px',width:'100%',borderRadius:'25px'}}
             value={outgoingType} onChange={(e)=>{
                setOutgoingType(e.target.value);
            }} >
                <option value='14000' >14000</option>
                <option value='others' >others</option>
            </select><br/>
            <button style={{ height: '40px', margin: '0.5rem 0 0.5rem 0', fontSize: '20px' }}
                onClick={submitDetails}>add</button>
                </div>
                </div>
        </div>
    )
}

export default Add;