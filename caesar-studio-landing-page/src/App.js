import './css/App.css';
import './css/bootstrap.css';
import './css/fontawesome-all.css';
import './css/magnific-popup.css';
import './css/styles.css';
import './css/swiper.css';
import { GoogleSpreadsheet } from "google-spreadsheet";
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';

function App() {

  const [data, setData] = useState({
    name:'',
    email:'',
    businessItem: [],
    agreeToTest: false,
    disableForm: false,
  })

  let scrollToAnchor = (e, anchorName) => {
    e.preventDefault();
    if(anchorName){
      let anchorElement = document.getElementById(anchorName);
      if(anchorElement){
        anchorElement.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        });
      }
    }
  }

  let submitInfo = async (e) => {
    try{
      e.preventDefault();
      setData({
        disableForm: true,
      })
  
      const doc = new GoogleSpreadsheet(process.env.REACT_APP_GSHEET_ID);
  
      await doc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_CLIENT_EMAIL,
        private_key: process.env.REACT_APP_PRIVATE_KEY,
      });
    
      await doc.loadInfo();
    
      const sheet = doc.sheetsByIndex[0];
    
      let businessString = '';
      if(data.businessItem){
        for(var i = 0; i <= data.businessItem.length; i++){
          businessString += data.businessItem[i] + ', ';
        }
      }
      let row = {
        name: data.name,
        email: data.email,
        business_item: businessString,
        agree_to_test: data.agreeToTest
      }
      await sheet.addRow(row);
      
      setData({
        name:'',
        email:'',
        businessItem: [],
        agreeToTest: false,
        disableForm: false,
      })
      document.getElementById('beauty').checked = false;
      document.getElementById('manicure').checked = false;
      document.getElementById('hairdressing').checked = false;
      document.getElementById('agreeToTest').checked = false;
    }catch(e){
      console.error('Google sheet API Error', e);
    }
  };

  const handleChange = (e) => {
    setData({
      ...data, [e.target.name] : e.target.value
    })
  }
  
  const handleFormChickbox = (value) => {
    let businessItem = data.businessItem;

    if(businessItem.includes(value)){
      businessItem.splice(businessItem.indexOf(value), 1);
    }else{
      businessItem.push(value);
    }

    setData({
      ...data, businessItem : businessItem
    })
  }
  return (
    <>
    {/* Navigation */}
    <nav class="navbar navbar-expand-lg fixed-top navbar-light">
        <div class="container">
            
            {/* Text Logo - Use this if you don't have a graphic logo */}
            {/* <a class="navbar-brand logo-text page-scroll" href="index.html">Pavo</a> */}

            {/* Image Logo */}
            <a class="navbar-brand logo-image" onClick={(e) => scrollToAnchor(e, 'header')} href="#">Caesar Studio</a> 

            <button class="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link page-scroll" onClick={(e) => scrollToAnchor(e, 'features')} href="#">功能特色</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link page-scroll" onClick={(e) => scrollToAnchor(e, 'contectUs')} href="#">聯絡我們</a>
                    </li>
                </ul>
            </div> {/* end of navbar-collapse */}
        </div> {/* end of container */}
    </nav> {/* end of navbar */}
    {/* end of navigation */}


    {/* Header */}
    <header id="header" class="header">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <div class="image-container">
                        <img class="img-fluid" src={process.env.PUBLIC_URL + "/resources/images/header-smartphone.png"} alt="alternative"/>
                    </div> {/* end of image-container */}
                </div> {/* end of col */}
                <div class="col-lg-6">
                    <div class="text-container">
                        <h1 class="h1-large">Caesar Studio</h1>
                        <p class="p-large">協助業者經營工作室，解決臉書社團店家搜尋混亂，沒辦法精準找到指定物件</p>
                    </div> {/* end of text-container */}
                </div> {/* end of col */}
            </div> {/* end of row */}
        </div> {/* end of container */}
    </header> {/* end of header */}
    {/* end of header */}

    {/* Features */}
    <div id="features" class="cards-1">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    
                    {/* Card */}
                    <div class="card">
                        <div class="card-image">
                            <img class="img-fluid" src={process.env.PUBLIC_URL + "/resources/images/features-icon-1.svg"} alt="alternative"/>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Platform Integration</h5>
                            <p>You sales force can use the app on any smartphone platform without compatibility issues</p>
                        </div>
                    </div>
                    {/* end of card */}

                    {/* Card */}
                    <div class="card">
                        <div class="card-image">
                            <img class="img-fluid" src={process.env.PUBLIC_URL + "/resources/images/features-icon-2.svg"} alt="alternative"/>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Easy On Resources</h5>
                            <p>Works smoothly even on older generation hardware due to our optimization efforts</p>
                        </div>
                    </div>
                    {/* end of card */}

                    {/* Card */}
                    <div class="card">
                        <div class="card-image">
                            <img class="img-fluid" src={process.env.PUBLIC_URL + "/resources/images/features-icon-3.svg"} alt="alternative"/>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Great Performance</h5>
                            <p>Optimized code and innovative technology insure no delays and ultra-fast responsiveness</p>
                        </div>
                    </div>
                    {/* end of card */}

                    {/* Card */}
                    <div class="card">
                        <div class="card-image">
                            <img class="img-fluid" src={process.env.PUBLIC_URL + "/resources/images/features-icon-4.svg"} alt="alternative"/>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Multiple Languages</h5>
                            <p>Choose from one of the 40 languages that come pre-installed and start selling smarter</p>
                        </div>
                    </div>
                    {/* end of card */}

                    {/* Card */}
                    <div class="card">
                        <div class="card-image">
                            <img class="img-fluid" src={process.env.PUBLIC_URL + "/resources/images/features-icon-5.svg"} alt="alternative"/>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Free Updates</h5>
                            <p>Don't worry about future costs, pay once and receive all future updates at no extra cost</p>
                        </div>
                    </div>
                    {/* end of card */}

                    {/* Card */}
                    <div class="card">
                        <div class="card-image">
                            <img class="img-fluid" src={process.env.PUBLIC_URL + "/resources/images/features-icon-6.svg"} alt="alternative"/>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Community Support</h5>
                            <p>Register the app and get acces to knowledge and ideas from the Pavo online community</p>
                        </div>
                    </div>
                    {/* end of card */}

                </div> {/* end of col */}
            </div> {/* end of row */}
        </div> {/* end of container */}
    </div> {/* end of cards-1 */}
    {/* end of features */}


    {/* Details 1 */}
    <div id="contectUs" class="basic-2">
        <div class="container">
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6 formBorder">
                  <h2>歡迎聯繫我們</h2>
                  <Form>
                  <fieldset disabled={data.disableForm}>
                    <Form.Group as={Row} className="mb-3" controlId="name">
                      <Form.Label column sm={3}>姓名</Form.Label>
                      <Col sm={9}>
                        <Form.Control type="text" placeholder="請輸入姓名" name="name" value={data.name} onChange={handleChange}/>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="email">
                      <Form.Label column sm={3}>e-mail</Form.Label>
                      <Col sm={9}>
                        <Form.Control type="text" placeholder="請輸入 e-mail" name="email" value={data.email} onChange={handleChange}/>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={3}>從事產業</Form.Label>
                      <Col sm={9} className="businessCheckBox">
                        <Form.Check inline type="checkbox" name="business" label="美容" id="beauty" onClick={() => handleFormChickbox('beauty')} />
                        <Form.Check inline type="checkbox" name="business" label="美甲" id="manicure" onClick={() => handleFormChickbox('manicure')}/>
                        <Form.Check inline type="checkbox" name="business" label="美髮" id="hairdressing" onClick={() => handleFormChickbox('hairdressing')}/>
                      </Col>
                    </Form.Group>
                    <br/>
                    <Form.Group className="mb-3" controlId="agree">
                      <Form.Check type="checkbox" id="agreeToTest" label="我願意收到測試版試用" name="agreeToTest" value={data.agreeToTest} onClick={() => data.agreeToTest = !data.agreeToTest}/>
                    </Form.Group>
                    <Button className="buttonRight" variant="primary" type="submit" onClick={submitInfo}>
                      送出
                    </Button>
                  </fieldset>
                  </Form>
                </div> {/* end of col */}
                <div class="col-lg-3"></div>
            </div> {/* end of row */}
        </div> {/* end of container */}
    </div> {/* end of basic-2 */}
    {/* end of details 1 */}

    {/* Footer */}
    <div class="footer">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h4>聯絡方式: <a class="purple" href="mailto:email@domain.com">email@domain.com</a></h4>
                </div> {/* end of col */}
            </div> {/* end of row */}
        </div> {/* end of container */}
    </div> {/* end of footer */}  
    {/* end of footer */}

  {/* <div className="App">
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
    </div> */}
  </>
  );
}

export default App;
