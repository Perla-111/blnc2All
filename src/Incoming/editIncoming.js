import React, { useEffect, useId, useState } from "react";
import fireDb from '../firebase';
import { v4 as uuidv4 } from 'uuid';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const EditIncoming = ({ receivedid, receiveddate, setIncomingEdittoggle, currentpath }) => {

    const incomingeditinputRef1 = React.useRef(null);
    const incomingeditinputRef2 = React.useRef(null);
    const incomingeditinputRef3 = React.useRef(null);

    const dateref = React.useRef(null);
    const [startDate, setStartDate] = useState(new Date(receiveddate));
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [id, setId] = useState('');
    const [note, setNote] = useState('');
    const [category, setCategory] = useState('');
    const [data, setData] = useState({});
    const [outgoingType, setOutgoingType] = useState('others');
    const [isImportant, setIsImportant] = useState(false);


    useEffect(() => {
        let monthpath = formatDate2(new Date(receiveddate)).date.slice(3);
        let yearpath = formatDate2(new Date(receiveddate)).fullyear;
        const path = `${currentpath}/_${yearpath}/_${monthpath}Income/`;
        fireDb.child(path).on("value", (snapshot) => {
            if (snapshot.val() !== null) {
                let data = snapshot.val();
                setData(data[receivedid]);
                setAmount(data[receivedid] ? data[receivedid].amount : 0);
                setDate(data[receivedid] ? data[receivedid].date : formatDate2(new Date(receiveddate)));
                setNote((data[receivedid] ? data[receivedid].note : ''));
                setCategory((data[receivedid] ? data[receivedid].category : ''));
                setId((data[receivedid] ? data[receivedid].id : uuidv4()));
                setOutgoingType(data[receivedid].type);
                setIsImportant(data[receivedid] ? data[receivedid]?.isImportant ?? false : false);
            }

            else { console.log('not working yet'); }
        })
    }, [receivedid])

    function formatDate(d) {
        var month = d.getMonth();
        var day = d.getDate().toString().padStart(2, '0');
        var year = d.getFullYear();
        year = year.toString().substr(-2);
        month = (month + 1).toString().padStart(2, '0');
        return `${day}-${month}${year}`;
    }
    function formatDate2(d) {
        var month = d.getMonth();
        var day = d.getDate().toString().padStart(2, '0');
        var fullyear = d.getFullYear();
        let year = fullyear.toString().substr(-2);
        month = (month + 1).toString().padStart(2, '0');
        return {
            date: `${day}-${month}${year}`,
            fullyear
        };
    }
    function getDate(d) {

        return `${d}`;
    }

    let d = new Date();

    const submitDetails = () => {
        let obj = {
            id,
            date: formatDate(dateref.current.props.selected) || date,
            amount: parseInt(amount),
            note,
            category,
            type: outgoingType,
            isImportant: isImportant
        }
        let newObj = Object.assign({}, { [receivedid]: data });
        const path = `${currentpath}/_${d.getFullYear()}/_${newObj[receivedid].date.slice(3)}Income/${receivedid}`;
        //console.log(obj,newObj,path)
        //console.log(dateref.current.props);
        fireDb.child(path).update(obj);
        fireDb.child('lastupdate/date/').update({ date: getDate(d) });

        setIncomingEdittoggle();

    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div >
                <DatePicker onFocus={(e) => { e.target.readOnly = true }}
                    className="date-picker-wrapper-addEdit"
                    ref={dateref} selected={startDate} onChange={(date) => {
                        //console.log(startDate);
                        setStartDate(date)
                    }} />
            </div>
            {/* <input type='text' 
        placeholder='dd-mmyy date'
        value={date}
        onChange={(e)=>{setDate(e.target.value)}}
        /><br/> */}
            <div>
                <span>incoming edit toggle</span><br />
                <input type='number'
                    placeholder='enter amount'
                    ref={incomingeditinputRef1}
                    value={amount}
                    onClick={() => { incomingeditinputRef1.current.focus(); }}
                    onChange={(e) => {
                        setAmount(e.target.value);
                    }}
                /><br />
                <input type='text'
                    ref={incomingeditinputRef2}
                    //placeholder='enter the reason'
                    placeholder='enter note'
                    value={note}
                    onClick={() => { incomingeditinputRef2.current.focus(); }}
                    onChange={(e) => {
                        setNote(e.target.value);
                    }}
                /><br />
                <input type='text'
                    ref={incomingeditinputRef3}
                    placeholder='enter category'
                    value={category}
                    onClick={() => { incomingeditinputRef3.current.focus(); }}
                    onChange={(e) => {
                        setCategory(e.target.value);
                    }}
                /><br />
                <select
                    style={{
                        color: 'white', backgroundColor: '#282c34',
                        padding: '5px', width: '100%', borderRadius: '25px'
                    }}
                    value={outgoingType}
                    onClick={(e) => {
                    }}
                    onChange={(e) => {
                        setOutgoingType(e.target.value);
                    }} >
                    <option value='others' >others</option>
                    <option value='14000' >14000</option>
                </select><br />
                <button style={{ height: '40px', margin: '0.5rem 0 0.5rem 0', fontSize: '20px' }}
                    onClick={submitDetails}>edit</button>
            </div>
        </div>
    )
}

export default EditIncoming;