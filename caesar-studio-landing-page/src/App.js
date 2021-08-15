import logo from './logo.svg';
import './App.css';
import { GoogleSpreadsheet } from "google-spreadsheet";
import { useState } from 'react';

function App() {

  const [data, setData] = useState({
    name:'',
    email:'',
  })
  
  let submitInfo = async (e) => {
    try{
      e.preventDefault();
  
      const doc = new GoogleSpreadsheet(process.env.REACT_APP_GSHEET_ID);
  
      await doc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_CLIENT_EMAIL,
        private_key: process.env.REACT_APP_PRIVATE_KEY,
      });
    
      await doc.loadInfo();
    
      const sheet = doc.sheetsByIndex[0];
    
      let row = {
        name: data.name,
        email: data.email
      }
      const result = await sheet.addRow(row);
    }catch(e){
      console.error('Google sheet API Error', e);
    }
  };

  const handleChange = (e) => {
    setData({
      ...data, [e.target.name] : e.target.value
    })
  }
  return (
    <div className="App">
      <header className="App-header">
        <form>
          <div>
            <label>
              姓名 : 
            </label>
            <input type='text' name='name' value={data.name} onChange={handleChange}/>
          </div>
          <div>
            <label>
              e-mail : 
            </label>
            <input type='text' name='email' value={data.email} onChange={handleChange}/>
          </div>
          <div>
            <button onClick={submitInfo}>送出</button>
          </div>
        </form>
      </header>
    </div>
  );
}

export default App;
