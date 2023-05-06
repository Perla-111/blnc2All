import React, { useEffect, useId, useState } from "react";
import fireDb from '../firebase';
import { v4 as uuidv4 } from 'uuid';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const AddIncoming = ({ currentpath, receiveddate }) => {
    useEffect(() => {
        setStartDate(receiveddate);
    }, [receiveddate]);

    const incomingaddinputRef1 = React.useRef(null);
    const incomingaddinputRef2 = React.useRef(null);
    const incomingaddinputRef3 = React.useRef(null);

    const dateref = React.useRef(null);
    const [startDate, setStartDate] = useState(new Date(receiveddate));
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [category, setCategory] = useState('');
    const [outgoingType, setOutgoingType] = useState('others');

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
            type: outgoingType
        }
        const path = `${currentpath}/_${formatDate2(dateref.current.props.selected).fullyear}/_${obj.date.slice(3)}Income`;
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div>
                    <DatePicker
                        onFocus={(e) => { e.target.readOnly = true }}
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
        <div>incoming</div>
                <div>
                    <input type='number'
                        ref={incomingaddinputRef1}
                        placeholder='enter amount'
                        value={amount}
                        onClick={() => { incomingaddinputRef1.current.focus(); }}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            incomingaddinputRef1.current.focus();
                        }}
                    /><br />
                    <input type='text'
                        ref={incomingaddinputRef2}
                        //placeholder='enter the reason'
                        placeholder='enter note'
                        value={note}
                        onClick={() => { incomingaddinputRef2.current.focus(); }}
                        onChange={(e) => { setNote(e.target.value); }}
                    /><br />
                    <input type='text'
                        ref={incomingaddinputRef3}
                        placeholder='enter category'
                        value={category}
                        onClick={() => { incomingaddinputRef3.current.focus(); }}
                        onChange={(e) => { setCategory(e.target.value); }}
                    /><br />
                    <select
                        onClick={(e) => { e.target.focus() }}
                        style={{
                            color: 'white', backgroundColor: '#282c34',
                            padding: '5px', width: '100%', borderRadius: '25px'
                        }}
                        value={outgoingType} onChange={(e) => {
                            setOutgoingType(e.target.value);
                        }} >
                        <option value='others' >others</option>
                        <option value='14000' >14000</option>
                    </select><br />
                    <button style={{ height: '40px', margin: '0.5rem 0 0.5rem 0', fontSize: '20px' }}
                        onClick={submitDetails}>add</button>
                </div>
            </div>
        </div>
    )
}

export default AddIncoming;