import './css/App.css';
import './css/bootstrap.css';
import './css/fontawesome-all.css';
import './css/magnific-popup.css';
import './css/styles.css';
import './css/swiper.css';
import { GoogleSpreadsheet } from "google-spreadsheet";
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {Autoplay, Pagination, Navigation} from 'swiper';
import { Button } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';

function App() {
  // sweet alert object
  const MySwal = withReactContent(Swal);
  // swiper object
  SwiperCore.use([Navigation, Autoplay, Pagination]);
  // 畫面物件
  const [data, setData] = useState({
    /****************
     * 畫面顯示物件 *
     ****************/
    isLoading: true,
    pageTitle: '',         // 標題
    introContent: '',      // 介紹內容
    featureList: [],       // 功能特色清單
    storeInfoList: [],     // 商家資訊
    /************
     * 表單物件 *
     ************/
    name: '',              // 姓名
    email: '',             // email
    businessItem: [],     // 從事產業
    agreeToTest: false,   // 是否同意接受測試版本試用
    disableForm: false,   // 送出時鎖定表單
    validated: false,     // 表單驗證結果
  })
  // 畫面初始化
  let initPage =async() => {
    // 1. 取得 gsheet 連結
    let doc = new GoogleSpreadsheet(process.env.REACT_APP_GSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.REACT_APP_CLIENT_EMAIL,
      private_key: process.env.REACT_APP_PRIVATE_KEY,
    });
    await doc.loadInfo();

    // 2. 取得首頁資訊
    let title;
    let content;
    const homePageSheet = doc.sheetsByIndex[1];
    await homePageSheet.getRows().then((rows) => {
      let homePageInfo = rows[0];
      title = homePageInfo.title;
      content = homePageInfo.content;
    })
    
    // 3. 取得功能特色資訊
    let featureList = [];
    const featuresSheet = doc.sheetsByIndex[2];
    await featuresSheet.getRows().then((rows) => {
      rows.forEach(function(featuresRow){
        let feature = {
          title: featuresRow.title,
          content: featuresRow.content,
          image: featuresRow.image
        }
        featureList.push(feature);
      })
    })

    // 4. 取得商家資訊
    let storeInfoList = [];
    const storeInfoSheet = doc.sheetsByIndex[3];
    await storeInfoSheet.getRows().then((rows) => {
      rows.forEach(function(storeInfoRow){
        let storeInfo = {
          image: storeInfoRow.image,
          name: storeInfoRow.name,
          content: storeInfoRow.content,
          url: storeInfoRow.url
        }
        storeInfoList.push(storeInfo);
      })
    })

    setData({
      ...data, 
      featureList : featureList,
      storeInfoList : storeInfoList,
      pageTitle : title,
      introContent : content,
      isLoading: false
    })
  }
  // 畫面滾動工具
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

  /************
   * 表單相關 *
   ************/
  // 更改輸入欄位
  const handleChange = (e) => {
    setData({
      ...data, [e.target.name] : e.target.value
    })
  }
  // 修改從事產業
  const handleBusinessItemChange = (value) => {
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
  // 送出按鈕
  let submitInfo = async (e) => {
    try{
      // 1. 移除原本送出會做的事情
      e.preventDefault();
      
      // 2. 取得 form 表單內容
      const form = e.currentTarget;

      // 3. 驗證表單
      if(!form.checkValidity()){
        setData({
          ...data,
          validated: true,
        })

        // 3.1 驗證失敗，中斷流程
        return;
      }

      // 4. 驗證成功，鎖定表單畫面
      setData({
        ...data,
        disableForm: true,
      })
  
      // 5. 取得 gsheet 連結
      let doc = new GoogleSpreadsheet(process.env.REACT_APP_GSHEET_ID);
      await doc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_CLIENT_EMAIL,
        private_key: process.env.REACT_APP_PRIVATE_KEY,
      });
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
    
      // 6. 組裝內容
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

      // 7. 寫入 gsheet
      await sheet.addRow(row);
      
      // 8. 清空表單
      setData({
        ...data,
        name:'',
        email:'',
        businessItem: [],
        agreeToTest: false,
        disableForm: false,
        validated: false,
      })
      document.getElementById('beauty').checked = false;
      document.getElementById('manicure').checked = false;
      document.getElementById('hairdressing').checked = false;
      document.getElementById('agreeToTest').checked = false;

      // 9. 跳出提示訊息
      MySwal.fire({
        icon: 'success',
        title: '感謝您的支持',
        text: '我們會盡快與您聯繫!',
      })
    }catch(error){
      console.error('Google sheet API Error', error);
    }
  };

  window.onload = function(){
    initPage();
  }
  return (
    <>
    {/* Navigation */}
    <nav class="navbar navbar-expand-lg fixed-top navbar-light">
        <div class="container">
            
            {/* Text Logo - Use this if you don't have a graphic logo */}
            {/* <a class="navbar-brand logo-text page-scroll" href="index.html">Pavo</a> */}

            {/* Image Logo */}
            <a class="navbar-brand logo-image" onClick={(e) => scrollToAnchor(e, 'header')} href="#">{data.pageTitle}</a> 

            <button class="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link page-scroll" onClick={(e) => scrollToAnchor(e, 'features')} href="#">功能特色</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link page-scroll" onClick={(e) => scrollToAnchor(e, 'storeInfos')} href="#">商家資訊</a>
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
              {
                data.isLoading ? (
                  <>
                    <div class="col-lg-4"></div>
                    <div class="col-lg-4 image-container">
                        <img class="img-fluid" src={process.env.PUBLIC_URL + "/resources/images/loading.gif"} alt="alternative"/>
                    </div>
                    <div class="col-lg-4"></div>
                  </>
                ) : (
                  <>
                    <div class="col-lg-6">
                        <div class="image-container">
                            <img class="img-fluid" src={process.env.PUBLIC_URL + "/resources/images/header-smartphone.png"} alt="alternative"/>
                        </div> {/* end of image-container */}
                    </div> {/* end of col */}
                    <div class="col-lg-6">
                        <div class="text-container">
                            <h1 class="h1-large">{data.pageTitle}</h1>
                            <p class="p-large">{data.introContent}</p>
                        </div> {/* end of text-container */}
                    </div> {/* end of col */}
                  </>
                )
              }
            </div> {/* end of row */}
        </div> {/* end of container */}
    </header> {/* end of header */}
    {/* end of header */}

    {/* Features */}
    <div id="features" class="cards-1" hidden={data.isLoading}>
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    
                    {/* Card */}
                    {
                      data.featureList.map((feature) => {
                        return (
                          <div class="card featureCard" key={feature.title}>
                              <div class="card-image">
                                  <img class="img-fluid" src={feature.image} alt="alternative"/>
                              </div>
                              <div class="card-body">
                                  <h5 class="card-title">{feature.title}</h5>
                                  <p>{feature.content}</p>
                              </div>
                          </div>
                        )
                      })
                    }
                    {/* end of card */}
                </div> {/* end of col */}
            </div> {/* end of row */}
        </div> {/* end of container */}
    </div> {/* end of cards-1 */}
    {/* end of features */}

    {/* <!-- Testimonials --> */}
    <div class="slider-1" id="storeInfos" hidden={data.isLoading}>
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h2 class="h2-heading">商家資訊</h2>
                </div> {/* <!-- end of col --> */}
            </div> {/* <!-- end of row --> */}
            <div class="row">
                <div class="col-lg-12">
                    {/* <!-- Card Slider --> */}
                    <Swiper 
                      navigation={true} 
                      slidesPerView={3}
                      autoplay={{
                        "delay": 5000,
                        "disableOnInteraction": false,
                      }}
                      pagination={{
                        "clickable": true
                      }}
                      className="mySwiper">
                        {
                          data.storeInfoList.map((storeInfo) => {
                            return (
                              <SwiperSlide key={storeInfo.name} className="storeInfoCard">
                                <div class="card">
                                  <img class="card-image" src={storeInfo.image} alt="alternative"/>
                                  <div class="card-body storeInfoContent">
                                    <p class="testimonial-author">{storeInfo.name}</p>
                                    <p>{storeInfo.content}</p>
                                  </div>
                                  <div class="button-wrapper">
                                      <a class="btn-solid-lg secondary" href={storeInfo.url} target="_blank">來去看看</a>
                                  </div>
                                </div>
                              </SwiperSlide>
                            )
                          })
                        }
                    </Swiper>
                    {/* <!-- end of card slider --> */}
                </div> {/* <!-- end of col --> */}
            </div> {/* <!-- end of row --> */}
        </div> {/* <!-- end of container --> */}
    </div> {/* <!-- end of slider-1 --> */}
    {/* <!-- end of testimonials --> */}

    {/* Details 1 */}
    <div id="contectUs" class="basic-2" hidden={data.isLoading}>
        <div class="container">
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6 formBorder">
                  <h2>歡迎聯繫我們</h2>
                  <Form noValidate validated={data.validated} onSubmit={submitInfo}>
                  <fieldset disabled={data.disableForm}>
                    <Form.Group as={Row} className="mb-3" controlId="name">
                      <Form.Label column sm={3}>姓名</Form.Label>
                      <Col sm={9}>
                        <Form.Control type="text" placeholder="請輸入姓名" name="name" value={data.name} onChange={handleChange} required/>
                        <Form.Control.Feedback type="invalid">
                          請輸入姓名
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="email">
                      <Form.Label column sm={3}>e-mail</Form.Label>
                      <Col sm={9}>
                        <Form.Control type="email" placeholder="請輸入 e-mail" name="email" value={data.email} onChange={handleChange} required/>
                        <Form.Control.Feedback type="invalid">
                          請輸入正確 e-mail
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={3}>從事產業</Form.Label>
                      <Col sm={9} className="businessCheckBox">
                        <Form.Check inline type="checkbox" name="business" label="美容" id="beauty" onClick={() => handleBusinessItemChange('beauty')} />
                        <Form.Check inline type="checkbox" name="business" label="美甲" id="manicure" onClick={() => handleBusinessItemChange('manicure')}/>
                        <Form.Check inline type="checkbox" name="business" label="美髮" id="hairdressing" onClick={() => handleBusinessItemChange('hairdressing')}/>
                      </Col>
                    </Form.Group>
                    <br/>
                    <Form.Group className="mb-3" controlId="agree">
                      <Form.Check type="checkbox" id="agreeToTest" label="我願意收到測試版試用" name="agreeToTest" value={data.agreeToTest} onClick={() => data.agreeToTest = !data.agreeToTest}/>
                    </Form.Group>
                    <Button className="buttonRight" variant="primary" type="submit">
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
  </>
  );
}

export default App;
