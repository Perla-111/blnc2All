import React, { useEffect, useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx';
//import {datafile} from './data';
//import { julyData, kalyan } from './july';
//import AppLogged from './Applogged'
import Add from './add page/add'
import fireDb from './firebase';
import Edit from './editpage/edit';

import DatePicker from "react-datepicker";
import AddIncoming from './Incoming/addIncoming';
import EditIncoming from './Incoming/editIncoming';

let currentPathNonState = 'details';

function App({ islogged, username, isBhabhi }) {

  // const [incomingEditToggle, setIncomingEditToggle] = useState(false);

  // const noData = {

  //     details: {
  //       _2022: {
  //         _0722: {
  //           _dummyData: {
  //             amount: "0",
  //             category: "no data",
  //             date: "01-0199",
  //             id: "nodata",
  //             note: "no data"
  //           }
  //         }
  //     }
  //   }
  // };
  const [incomingMoneyToggle, setIncomingMoneyToggle] = React.useState(false);
  const [outcomingMoneyToggle, setOutcomingMoneyToggle] = React.useState(false);
  let indexCount = 0;


  const dateref = React.useRef(null);
  const [startDate, setStartDate] = useState(new Date());

  function formatDate(d) {
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

  //let d = new Date();
  // let showDate = formatDate(startDate);
  //  useEffect(()=>{
  //   setShowDate(formatDate(showDate));
  //  },[startDate]);
  const [showDate, setShowDate] = React.useState(formatDate(startDate));
  const [yearToShow, setYearToShow] = React.useState(showDate.fullyear);
  const [monthToShow, setMonthToShow] = React.useState(showDate.date.slice(3));


  const [showData, setShowData] = React.useState([]);
  const [lastMonthBalance, setLastMonthBalance] = useState(0);
  const [otherIncomeBalance, setOtherIncomeBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = React.useState(0);
  //const [kcurrentBalance,setkCurrentBalance] = React.useState(0);
  const [editmode, setEditMode] = useState(false);
  const [incomingeditmode, setIncomingEditMode] = useState(false);
  const [editId, setEditId] = useState();
  const [incomingeditId, setIncomingEditId] = useState();
  const [editDate, setEditDate] = useState();
  const [editIncomingDate, setIncomingEditDate] = useState();

  //const salary = 118027, ksalary = 29087;
  const ksalary = 29087;
  const kprevBalance = 11659;
  //const prevBalance = 15012, kprevBalance = 11659;
  const [lSalary, setSalary] = useState(0);
  const salaryinputRef1 = React.useRef(null);
  const salaryinputRef2 = React.useRef(null);
  const otherinputRef3 = React.useRef(null);
  const [salaryEditToggle, setSalaryEditToggle] = React.useState(false);
  const [startOfMonthBalance, setStartOfMonthBalance] = React.useState(parseInt(lSalary) + parseInt(lastMonthBalance)
    + parseInt(otherIncomeBalance ?? 0));


  let assign = 0;
  const [demo, setDemo] = React.useState([]);
  const [modifiedDemo, setModifiedDemo] = React.useState([]);
  const [incomingAmountList, setIncomingAmountList] = React.useState([]);
  const [modifiedIncomingAmountList, setModifiedIncomingAmountList] = React.useState([]);
  const [showOtherDetails, setShowOtherDetails] = React.useState(false);


  const [toggle, setToggle] = React.useState(false);
  const [kharchu, setKharchu] = React.useState(0);
  const [currentpath, setCurrentPath] = useState(currentPathNonState);
  const [lastupdate, setLastUpdate] = useState('loading...');

  // useEffect(()=>{
  //   if(showDate!==undefined){
  //   setMonthToShow(showDate.date.slice(3));
  //   setYearToShow(showDate.fullyear);
  //   console.log(showDate);
  //   }

  // },[showDate,startDate]);

  useEffect(() => {
    fireDb.child('lastupdate/date/date').on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        //console.log(snapshot.val());
        setLastUpdate(snapshot.val());
      }
      else setLastUpdate('not available')
    })
  })
  useEffect(() => {
    fireDb.child(currentpath).on("value", (snapshot) => {
      if (snapshot.val()[`_${yearToShow}`] !== undefined
        && snapshot.val()[`_${yearToShow}`][`_${monthToShow}salary`] !== undefined) {
        let dataObj2 = snapshot.val()[`_${yearToShow}`][`_${monthToShow}salary`]['salary'];
        setSalary(dataObj2.salary);
        setLastMonthBalance(dataObj2.lastMonthBalance);
        setOtherIncomeBalance(dataObj2.otherIncomeBalance ?? 0);
        setStartOfMonthBalance(dataObj2.salary + dataObj2.lastMonthBalance + (dataObj2.otherIncomeBalance ?? 0));
      }
      else {
        console.log('salary details not available');
        setSalary(0);
        setLastMonthBalance(0);
        setOtherIncomeBalance(0);
        setStartOfMonthBalance(0);
        setCurrentBalance(0);
        setKharchu(0);
      }
    });
  }, [currentpath, toggle, startDate, salaryEditToggle]);
  useEffect(() => {
    //let path;
    //console.log(toggle);
    //if(!toggle) path='details';
    //else path='kalyan';
    fireDb.child(currentpath).on("value", (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== undefined) {
        //console.log(snapshot.val());
        //below "".accessor" thing needs to be dynamic
        //let accessor = `${snapshot.val()}._${yearToShow}._${monthToShow}`
        // let dataObj = snapshot.val()._2022._0722;
        //console.log(yearToShow,monthToShow);
        //console.log(snapshot.val()[`_${yearToShow}`].hasOwnProperty(`_${monthToShow}`))
        let dataObj2 = {};
        if (snapshot.val().hasOwnProperty(`_${yearToShow}`)
          && snapshot.val()[`_${yearToShow}`].hasOwnProperty(`_${monthToShow}`)) {
          dataObj2 = snapshot.val()[`_${yearToShow}`][`_${monthToShow}`];
        }
        let modifiedDataObj2 = dataObj2 && Object.keys(dataObj2).map((id) => dataObj2[id]).sort((a, b) => formatDateForSort(b.date) - formatDateForSort(a.date));
        setDemo(dataObj2);
        setModifiedDemo(modifiedDataObj2);
      }
      else {
        console.log('table data did not came')
      }
    });
    //console.log(showDate);
  }, [editmode, toggle, startDate])

  //Incoming data
  useEffect(() => {
    fireDb.child('details').on("value", (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== undefined) {

        let dataObj2 = {};
        if (snapshot.val().hasOwnProperty(`_${yearToShow}`)
          && snapshot.val()[`_${yearToShow}`].hasOwnProperty(`_${monthToShow}Income`)) {
          dataObj2 = snapshot.val()[`_${yearToShow}`][`_${monthToShow}Income`];
        }
        //console.log(dataObj2);
        setIncomingAmountList(dataObj2);
        let modifiedDataObj2 = dataObj2 && Object.keys(dataObj2).map((id) => dataObj2[id]).sort((a, b) => formatDateForSort(b.date) - formatDateForSort(a.date));
        setModifiedIncomingAmountList(modifiedDataObj2);
      }
      else {
        console.log('incoming table data did not came')
      }
    });
  }, [
    incomingeditmode,
    startDate])

  useEffect(() => {
    if (demo) {
      let data = Object.keys(demo).map((key) => demo[key]);
      let sum = 0;
      //console.log(data)
      for (let i = 0; i < data.length; i++) {

        //date comparisiom needs to be dynamic
        if (data[i].date.slice(3) === monthToShow
          //below validation can be removed
          //|| data[i].date.slice(3) === '07/22' || data[i].date.slice(3) === '07-22' || data[i].date.slice(3) === '0722'
        ) {
          sum = sum + data[i].amount;
        }


      }
      if (!toggle)
        assign = lSalary + lastMonthBalance + sum + (otherIncomeBalance ?? 0);
      else assign = lSalary + lastMonthBalance + sum + (otherIncomeBalance ?? 0);
      setCurrentBalance(assign);
      setKharchu(sum);
    }
    else if (lSalary && lastMonthBalance) {
      setCurrentBalance(lSalary + lastMonthBalance + (otherIncomeBalance ?? 0));
      setKharchu(0);
    }
    else {
      setCurrentBalance(lSalary + lastMonthBalance + (otherIncomeBalance ?? 0));
      setKharchu(0);
    }

  }, [toggle, demo, salaryEditToggle])

  function toggleEditId(id, date) {
    // console.log(id,date);
    let formateddate = date.substr(3, 2) + '-' + date.substr(0, 2) + '-' + date.slice(5);
    let newdate = new Date(formateddate).toString();
    // console.log(date,newdate);
    //console.log(formateddate,newdate);
    setEditDate(newdate);
    setEditId(id);
    setEditMode(true);
  }
  function toggleIncomingEditId(id, date) {
    //console.log(id,Date);
    let formateddate = date.substr(3, 2) + '-' + date.substr(0, 2) + '-' + date.slice(5);
    let newdate = new Date(formateddate).toString();
    //console.log(formateddate,newdate);
    setIncomingEditDate(newdate);
    setIncomingEditId(id);
    setIncomingEditMode(true);
  }
  function setEdittoggle() {

    setEditMode(false);

  }
  function setIncomingEdittoggle() {

    setIncomingEditMode(false);

  }
  function updateSalary() {
    const path = `${currentpath}/_${yearToShow}/_${monthToShow}salary/salary`;
    fireDb.child(path).update({
      salary: parseInt(salaryinputRef1.current.value),
      lastMonthBalance: parseInt(salaryinputRef2.current.value),
      otherIncomeBalance: parseInt(otherinputRef3.current.value)
    });
    setStartOfMonthBalance(parseInt(salaryinputRef1.current.value) + parseInt(salaryinputRef2.current.value)
      + parseInt(otherinputRef3.current.value));
  }
  function formatTableDate(d) {
    let firstPart = d.substr(0, 2);
    let secondPart = d.substr(3, 2);
    let thirdPart = d.substr(5, 2);
    return `${firstPart}_${secondPart}_${thirdPart}`;
  }
  function formatDateForSort(d) {
    let firstPart = d.substr(0, 2);
    let secondPart = d.substr(3, 2);
    let thirdPart = d.substr(5, 2);
    return Number(`${firstPart}${secondPart}${thirdPart}`);
  }
  function formatMonth(d) {
    let monthName = d.toLocaleString('default', { month: 'long' });
    return monthName;
  }

  function incomingDetails() {
    setIncomingMoneyToggle(!incomingMoneyToggle);
  }
  function outcomingDetails() {
    setOutcomingMoneyToggle(!outcomingMoneyToggle);
  }
  const [_14000, set_14000] = React.useState(0);

  useEffect(() => {
    if (demo) {
      let _14000filter = Object.keys(demo)
        .filter((id) => ((demo[id].type).toString() === '14000'))
        .map((id) => { //console.log(demo[id].type);
          return demo[id].amount
        });

      let _14 = _14000filter.length > 0 && _14000filter.reduce((initial, value, index, arr) => {
        return initial + value;
      });
      set_14000(_14);
    }
  }, [demo]);

  const toggleIsImportant = (receivedid, item, toggle, incoming) => {
    let d = new Date('20' + item.date.slice(5));
    if (incoming) {
      let obj = {
        ...item,
        isImportant: toggle
      }
      const path = `${currentpath}/_${d.getFullYear()}/_${item.date.slice(3)}Income/${receivedid}`;
      fireDb.child(path).update(obj);
    }
    else {
      let obj = {
        ...item,
        isImportant: toggle
      }
      // let newObj = Object.assign({}, { [item.id]: data });
      const path = `${currentpath}/_${d.getFullYear()}/_${item.date.slice(3)}/${receivedid}`;
      //console.log(obj,newObj,path)
      //console.log(dateref.current.props);
      // console.log(path);
      //add code to show response on UI using firebase set() along with update
      fireDb.child(path).update(obj);
      // fireDb.child('lastupdate/date/').update({ date: getDate(d) });
    }
  }

  return (
    <div className="App">

      <header className="App-header">
        {!editmode ? (islogged &&
          <Add
            currentpath={currentpath}
            receiveddate={startDate}
          />) :
          (islogged &&
            <Edit
              currentpath={currentpath}
              receivedid={editId}
              receiveddate={editDate}
              setEdittoggle={setEdittoggle}
            />)}
        <p
          onClick={() => {
            if (isBhabhi) {
              return;
            }
            if (!toggle) {
              currentPathNonState = 'kalyan';
              setCurrentPath(currentPathNonState);
              setToggle(!toggle);
            }
            else {
              currentPathNonState = 'details';
              setCurrentPath(currentPathNonState);
              setToggle(!toggle);
            }
          }}
        >Hello!!! <b style={{ color: 'dodgerblue' }}>{currentpath === 'details' ? username !== 'amruthavani' ? 'Laxmana Rao' : 'Amrutha Vani' : 'Kalyan'}</b> <br />  last updated time = {lastupdate}</p>




        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>


          {/* other info details */}

          {!isBhabhi && <span style={{ display: 'inline-block', width: '15px' }} onClick={() => { setShowOtherDetails(!showOtherDetails) }}>
            <b style={{ color: 'dodgerblue' }}>&#9776;</b></span>}
          {showOtherDetails && !isBhabhi && <>
            <>
              {islogged && salaryEditToggle &&
                <div>
                  <input type='number' value={lSalary}
                    placeholder='enter salary'
                    ref={salaryinputRef1}
                    onClick={() => { salaryinputRef1.current.focus(); }}
                    onChange={(e) => {
                      setSalary(e.target.value);
                      //salaryinputRef1.current.focus();
                    }}
                  /><br />
                  <input type='number'
                    ref={salaryinputRef2}
                    onClick={() => { salaryinputRef2.current.focus(); }}
                    placeholder='last month balance...'
                    value={lastMonthBalance}
                    onChange={(e) => { setLastMonthBalance(e.target.value); }}
                  /><br />
                  <input type='number'
                    ref={otherinputRef3}
                    onClick={() => { otherinputRef3.current.focus(); }}
                    placeholder='other incoming balance...'
                    value={otherIncomeBalance}
                    onChange={(e) => { setOtherIncomeBalance(e.target.value); }}
                  /><br />
                  <button onClick={() => {
                    setSalaryEditToggle(false);
                    updateSalary();
                  }} >add/update</button>
                </div>}</>
            {
              !toggle ? <>

                <div style={{ marginTop: '1rem' }}
                  onClick={() => { setSalaryEditToggle(!salaryEditToggle) }}>
                  <span><b style={{ color: 'dodgerblue' }}>Start of month balance</b> = {startOfMonthBalance}
                  </span><br />
                  <span style={{ paddingRight: '10px' }}><b style={{ color: 'dodgerblue' }}>
                    {/* {formatMonth(startDate)} */}
                    last month salary</b>={lSalary}</span><br />
                  <span style={{ paddingRight: '10px' }}><b style={{ color: 'dodgerblue' }}>
                    {/* {formatMonth(startDate)} */}
                    Other income balance</b>={otherIncomeBalance}</span><br />
                  <div style={{ paddingRight: '10px', border: '2px solid dodgerblue' }}><b style={{ color: 'dodgerblue' }}>
                    last month balance </b>= {lastMonthBalance}</div>

                </div>
                <div>
                  <span><b style={{ color: 'dodgerblue' }}>
                    Today's balance</b> = {currentBalance}
                  </span>
                  <br />
                  <span style={{ paddingRight: '10px' }}>
                    <b style={{ color: 'dodgerblue' }}>Total Kharchu</b> = &nbsp;{kharchu}
                    {/* {kharchu < 0
                  ? <><b>{kharchu.toString().substr(0,1)}</b>{kharchu.toString().slice(1)}</>
                  : {kharchu}
                } */}
                  </span><br />
                  {currentpath === 'details' &&
                    <div style={{ border: '2px solid dodgerblue' }}><b style={{ color: 'dodgerblue' }}>
                      14000 kharchu </b> = {(_14000 < -14000) ? `14000+${(_14000 + 14000).toString().slice(1)}` : _14000}
                    </div>}
                </div></>
                : <>
                  <div style={{ marginTop: '1rem' }} onClick={() => { setSalaryEditToggle(!salaryEditToggle) }}>
                    <span><b style={{ color: 'dodgerblue' }}>Start of month balance</b> = {startOfMonthBalance}
                    </span><br />
                    <span style={{ paddingRight: '10px' }}><b style={{ color: 'dodgerblue' }}>
                      {/* {formatMonth(startDate)} */}
                      last month salary</b>={lSalary}</span><br />
                    <span style={{ paddingRight: '10px' }}><b style={{ color: 'dodgerblue' }}>
                      {/* {formatMonth(startDate)} */}
                      Other income balance</b>={otherIncomeBalance}</span><br />
                    <div style={{ paddingRight: '10px', border: '2px solid dodgerblue' }}><b style={{ color: 'dodgerblue' }}>
                      last month balance </b>= {lastMonthBalance}</div>

                  </div>
                  <p>
                    <span><b style={{ color: 'dodgerblue' }}>
                      Today's balance</b> = {currentBalance}
                    </span>
                    <br />
                    <span style={{ paddingRight: '10px' }}>
                      <b style={{ color: 'dodgerblue' }}>total Kharchu</b> = &nbsp;{kharchu}
                      {/* {kharchu < 0
                  ? <><b>{kharchu.toString().substr(0,1)}</b>{kharchu.toString().slice(1)}</>
                  : {kharchu}
                } */}
                    </span><br />
                    {currentpath === 'details' && <span><b style={{ color: 'dodgerblue' }}>
                      14000 kharchu</b> = {_14000}
                    </span>}
                  </p></>
            }
          </>}
          {/* date and tabs selection */}



          <div style={{
            margin: '1rem 0 1rem 0',
            display: 'flex',
            flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-between', width: '100%'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row', alignItems: 'center',
              justifyContent: 'center', width: 'fit-content'
            }}>
              <div><b style={{ color: 'dodgerblue' }}>
                {formatMonth(startDate)}</b>&nbsp;</div>
              <DatePicker onFocus={(e) => { e.target.readOnly = true }}
                className='date-picker-wrapper' ref={dateref} selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setShowDate(formatDate(date));
                  setMonthToShow(formatDate(date).date.slice(3));
                  setYearToShow(formatDate(date).fullyear);
                }} />

            </div>
            <div style={{
              color: '#ffa899', fontWeight: '500',
              border: '2px solid #ffa899', borderRadius: '25px', padding: '5px'
            }}
              onClick={outcomingDetails} >Outgoing</div>
            {!isBhabhi && <div style={{
              color: 'lightgreen', fontWeight: '500',
              border: '2px solid lightgreen', borderRadius: '25px', padding: '5px'
            }}
              onClick={incomingDetails} >Incoming</div>}
          </div>
          <hr style={{ height: '3px', border: '2px solid #ffa899', width: '100%' }} />


          {/* outgoing table */}


          {outcomingMoneyToggle ?
            <div style={{ marginLeft: '1rem' }}>
              <table border='2px solid' >
                <thead>
                  <tr style={{ fontSize: '20px', color: '#ffa899' }}>
                    <td >Date</td>
                    <td style={{ paddingLeft: '10px' }}>Amount</td>
                    <td>Note</td>
                    <td style={{ paddingLeft: '10px' }}>Category</td>
                  </tr>
                </thead>
                <tbody>
                  {

                    /* with objects
                    demo && Object.keys(demo).map((id) => {
 
                      return <tr key={id}
                        style={{ backgroundColor: `${demo[id].type === '14000' ? 'rgb(85, 85, 85)' : ''}` }}
                        onClick={() => {//setEditMode(editmode);
                          toggleEditId(id, demo[id].date);
                        }}>
                        <td >{formatTableDate(demo[id].date)}
                        </td>
                        <td style={{ paddingLeft: '10px' }}>
                          {demo[id].amount > 0 ? <span style={{ color: 'lightgreen', fontWeight: '500' }}>+{demo[id].amount}</span> : demo[id].amount} </td>
                        <td> {demo[id].note} </td>
                        <td style={{ paddingLeft: '10px' }}>{demo[id].category} </td>
                      </tr>
 
                    }) */
                    /* with array */
                    modifiedDemo && modifiedDemo.map((item, index) => {
                      return <tr key={index + 'outgoing' + indexCount++}
                        style={{ backgroundColor: `${item.type === '14000' ? 'rgb(85, 85, 85)' : ''}` }}
                      >
                        <td
                          onClick={() => {//setEditMode(editmode);
                            let newArrayId = Object.keys(demo).filter((id) => demo[id].id === item.id)
                            toggleEditId(newArrayId, item.date);
                          }}
                        >{formatTableDate(item.date)}
                        </td>
                        <td
                          onClick={() => {//setEditMode(editmode);
                            let newArrayId = Object.keys(demo).filter((id) => demo[id].id === item.id)
                            toggleEditId(newArrayId, item.date);
                          }}
                          style={{ paddingLeft: '10px' }}>
                          {item.amount > 0 ? <span style={{ color: 'lightgreen', fontWeight: '500' }}>+{item.amount}</span> : item.amount} </td>
                        <td
                          style={{ backgroundColor: item.isImportant ? 'darkcyan' : '' }}
                          onDoubleClick={() => {
                            if (username === 'laxman' || username === 'kalyan') {
                              let newArrayId = Object.keys(demo).filter((id) => demo[id].id === item.id)
                              toggleIsImportant(newArrayId, item, item.isImportant ? !true : !false, false)
                            }
                          }}
                        > {item.note} </td>
                        <td
                          style={{ paddingLeft: '10px', backgroundColor: item.isImportant ? 'darkcyan' : '' }}
                          onDoubleClick={() => {
                            if (username === 'laxman' || username === 'kalyan') {
                              let newArrayId = Object.keys(demo).filter((id) => demo[id].id === item.id)
                              toggleIsImportant(newArrayId, item, item.isImportant ? !true : !false, false)
                            }
                          }}
                        >{item.category} </td>
                      </tr>

                    })

                  }

                </tbody>
              </table>
            </div> :
            !demo
              ? `no data outgoing for ${monthToShow} month`
              :
              <span>{'click '}<span style={{ color: '#ffa899', fontWeight: '500' }}
                onClick={outcomingDetails} >Outgoing</span>{' to show details'}</span>
          }



          {/* incoming table */}



          <hr style={{ height: '3px', border: '2px solid lightgreen', width: '100%', marginTop: `${outcomingMoneyToggle ? '2rem' : ''}` }} />
          {currentPathNonState === 'details' && incomingMoneyToggle && !isBhabhi ?
            <div style={{ marginLeft: '1rem' }}>
              <table border='2px solid' style={{ borderColor: 'lightgreen', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ fontSize: '20px', color: 'lightgreen' }}>
                    {/* <td >Date</td> */}
                    <td>Date</td>
                    <td style={{ paddingLeft: '10px' }}>Amount</td>
                    <td style={{ paddingLeft: '10px' }}>Note</td>
                    <td style={{ paddingLeft: '10px' }}>Category</td>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {
                /* with keys
                {incomingAmountList &&
                  Object.keys(incomingAmountList).map((id) => (
                    <tr key={id}
                      onClick={() => {//setEditMode(editmode);
                        toggleIncomingEditId(id, incomingAmountList[id].date);
                      }}>
                      {/* <td >{formatTableDate(incomingAmountList[id].date)}
        </td> }
                      <td> {incomingAmountList[id].note} </td>
                      <td style={{ paddingLeft: '10px' }}>
                        <span style={{ color: 'lightgreen', fontWeight: '500' }}>+{incomingAmountList[id].amount}</span></td>
                      <td style={{ paddingLeft: '10px' }}>{incomingAmountList[id].category} </td>
                    </tr>
                  ))} */}
                  </>
                  {modifiedIncomingAmountList &&
                    modifiedIncomingAmountList.map((item, index) => (
                      <tr key={index + 'incoming' + indexCount++}
                      >
                        <td
                          onClick={() => {
                            let newIncomingArrayId = Object.keys(incomingAmountList).filter((id) => incomingAmountList[id].id === item.id)
                            toggleIncomingEditId(newIncomingArrayId, item.date);
                          }}
                        > {formatTableDate(item.date)} </td>
                        <td
                          onClick={() => {
                            let newIncomingArrayId = Object.keys(incomingAmountList).filter((id) => incomingAmountList[id].id === item.id)
                            toggleIncomingEditId(newIncomingArrayId, item.date);
                          }}
                          style={{ paddingLeft: '10px' }}>
                          <span style={{ color: 'lightgreen', fontWeight: '500' }}>+{item.amount}</span></td>
                        <td
                          style={{ paddingLeft: '10px', backgroundColor: item.isImportant ? 'darkcyan' : '' }}
                          onDoubleClick={() => {
                            if (username === 'laxman' || username === 'kalyan') {
                              let newIncomingArrayId = Object.keys(incomingAmountList).filter((id) => incomingAmountList[id].id === item.id)
                              toggleIsImportant(newIncomingArrayId, item, item.isImportant ? !true : !false, true)
                            }
                          }}
                        > {item.note} </td>
                        <td style={{ paddingLeft: '10px', backgroundColor: item.isImportant ? 'darkcyan' : '' }}
                          onDoubleClick={() => {
                            if (username === 'laxman' || username === 'kalyan') {
                              let newIncomingArrayId = Object.keys(incomingAmountList).filter((id) => incomingAmountList[id].id === item.id)
                              toggleIsImportant(newIncomingArrayId, item, item.isImportant ? !true : !false, true)
                            }
                          }}
                        >{item.category} </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            :
            !isBhabhi ? <span>{'click '}<span style={{ color: 'lightgreen', fontWeight: '500', marginBottom: '1rem' }}
              onClick={incomingDetails} >Incoming</span>{' to show details'}</span> : null
          }


          {/* incoming add or edit view */}


          {incomingMoneyToggle ?
            <div style={{ marginBottom: '1rem' }}>
              {!incomingeditmode
                ?
                (islogged &&
                  <AddIncoming
                    currentpath={'details'}
                    receiveddate={startDate} />)
                :
                (islogged &&
                  <EditIncoming
                    currentpath={'details'}
                    receivedid={incomingeditId}
                    receiveddate={editIncomingDate}
                    setIncomingEdittoggle={setIncomingEdittoggle}
                  />)}
            </div> : ''}
        </div>






      </header>
    </div>
  );
}

export default App;

{/*}
        <input type="file" 
        onChange={(e)=>{
          const file = e.target.files[0];
          readExcel(file);
        }}
        ></input><br/> */}
/*
  const readExcel=(file)=>{
    const promise = new Promise((resolve,reject)=>{
      const fileReader = new FileReader();

      fileReader.readAsArrayBuffer(file);
      fileReader.onload=(e)=>{
        const bufferArray = e.target.result;

        const workbook = XLSX.read(bufferArray,{type:'buffer'});

        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        resolve(data);
      }

      fileReader.onerror=((error)=>{
        reject(error);
      })

    });

    promise.then((data)=>{
      //console.log(data);
      let reversedData = [];
      for(let k=data.length-1;k>=0;k--){
        reversedData.push(data[k]);
      }
      //console.log(reversedData);
      setShowData(reversedData);
      let dateArray=[[]],months=data[0].Date,sum=0;
      for(let i=0,j=0;i<data.length-1;i++){
        
        if(months.slice(3)===data[i].Date.slice(3)){
          dateArray[j].push(data[i]);
        }
        else{
          j++;
          dateArray.push([]);
          months=data[i].Date;
          i--;
        }
        if(data[i].Date.slice(3)==='07/22'){sum = sum + data[i].Amount;
          console.log(data[i].Amount);
        }


      }
      assign = salary+prevBalance+sum;
      setCurrentBalance(assign);
      //console.log(dateArray);
      //setDemo(dateArray);
      setDemo(julyData);
      console.log(sum,'sum',assign,'assign',salary,'salary',prevBalance,'prevBalance');
      
    })
  }
  */

/**
 * 
      /* {
            demo&&demo.map((month,index)=>{
              
              
              return <div key={index} style={{display:'flex',
              flexDirection: 'column-reverse'}}>
                {!toggle?<>
                <p><span style={{paddingRight:'10px'}}><b style={{color:'dodgerblue'}}>June Salary</b>={salary}</span>
                <span style={{paddingRight:'10px'}}><b style={{color:'dodgerblue'}}>last month balance </b>= {prevBalance}</span>
                <span><b style={{color:'dodgerblue'}}>Start of month balance</b> = {salary+prevBalance}</span></p>
                <p><span style={{paddingRight:'10px'}}><b style={{color:'dodgerblue'}}>Kharchu</b> = {kharchu}</span>
                <span><b style={{color:'dodgerblue'}}>Today's balance</b> = {currentBalance}</span></p></>
                :<>
                <p><span style={{paddingRight:'10px'}}><b style={{color:'dodgerblue'}}>June Salary</b>={ksalary}</span>
                <span style={{paddingRight:'10px'}}><b style={{color:'dodgerblue'}}>last month balance </b>= {kprevBalance}</span>
                <span><b style={{color:'dodgerblue'}}>Start of month balance</b> = {ksalary+kprevBalance}</span></p>
                <p><span style={{paddingRight:'10px'}}><b style={{color:'dodgerblue'}}>Kharchu</b> = {kharchu}</span>
                <span><b style={{color:'dodgerblue'}}>Today's balance</b> = {currentBalance}</span></p>
                </>}
                <table border='2px solid'>
        <thead>
          
        <tr style={{fontSize:'20px',color:'dodgerblue'}}>
        <td >Date</td>
        <td style={{paddingLeft:'10px'}}>Amount</td>
        <td>Note</td>
        <td style={{paddingLeft:'10px'}}>Category</td>
        </tr>
        </thead>
        <tbody>
          {
            
              month.map((item,index)=>{
                
                return <tr key={item.Date+item.Note+index} 
                onClick={()=>{//setEditMode(editmode);
                  toggleEditId(item.id,item.Date);}}>
                <td > {item.Date} </td>
                <td style={{paddingLeft:'10px'}}> {item.Amount} </td>
                <td> {item.Note} </td>
                <td style={{paddingLeft:'10px'}}>{item.Category} </td>
              </tr>
              
              })

            
          }
          
        </tbody>
      </table>
      </div>
      
            })
    } */

