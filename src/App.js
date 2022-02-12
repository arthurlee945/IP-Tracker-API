import React from 'react';
import './App.scss';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      input:"",
      ip:"8.8.8.8",
      location:"",
      timezone:"",
      isp:"",
      latitude:"",
      longitude:"",
      correct:true
    };
    this.handleInput = this.handleInput.bind(this);
    this.pressEnter = this.pressEnter.bind(this);
    this.btnClick = this.btnClick.bind(this);
  }
  componentDidMount(){
    document.addEventListener("keypress", this.pressEnter);
    fetch("https://geo.ipify.org/api/v2/country,city?apiKey=at_x4yoRR7TkOcLXFShogyWZQztZ1t2r&ipAddress="+this.state.ip).then(response =>{
        return response.json();
    }).then(data=> this.setState({
        location: `${data.location.city}, ${data.location.region} ${data.location.postalCode}`,
        timezone: "UTC"+data.location.timezone,
        isp: data.isp,
        latitude: data.location.lat,
        longitude: data.location.lng
    })); 

  }
  componentDidUpdate(prevProps, prevStates){
    if(prevStates.ip !== this.state.ip){
      fetch("https://geo.ipify.org/api/v2/country,city?apiKey=at_x4yoRR7TkOcLXFShogyWZQztZ1t2r&ipAddress="+this.state.ip).then(response =>{
        return response.json();
      }).then(data=>{ 
          if(data.code ===422){
            document.getElementById("inputarea").placeholder ="Input correct IPv4 or IPv6 address.";
            this.setState({correct:false})
          }
          else{
              document.getElementById("inputarea").placeholder ="000.000.000.000"
              this.setState({
          location: `${data.location.city}, ${data.location.region} ${data.location.postalCode}`,
          timezone: "UTC"+data.location.timezone,
          isp: data.isp,
          latitude: data.location.lat,
          longitude: data.location.lng,
          correct:true
          })
        };
      })
    }
  }
  componentWillUnmount(){
    document.removeEventListener("keypress", this.pressEnter);
  }

  pressEnter(e){
    if(e.keyCode ===13){
      this.setState({
        ip:this.state.input,
        input:""
      })
    }
  }
  btnClick(){
    this.setState({
      ip:this.state.input,
      input:""
    })
  }
  handleInput(e){
    this.setState({
      input: e.target.value
    })
  }

  render(){
    let googleMap = "https://maps.google.com/maps?q="+this.state.latitude+","+this.state.longitude+"&output=embed";
    let correctIp = this.state.correct? this.state.ip : "Invalid";
    let correctLocation = this.state.correct? this.state.location : "Invalid";
    let correctTimeZone = this.state.correct? this.state.timezone : "Invalid";
    let correctIsp = this.state.correct? this.state.isp : "Invalid";
    
    return (
      <div>
        <div className ="topContainer">

          <div className ="header">
            <h1>IP Address Tracker</h1>
            <div className="inputBox">
              <input id="inputarea" type ="text" onChange ={this.handleInput} placeholder ="000.000.000.000" value ={this.state.input} required/>
            <button onClick = {this.btnClick}><i className="fa fa-chevron-right"></i></button>
            </div>
          </div>

          <div className ="ipInfos">
            <section>
              <h3>Ip Address</h3>
              <h2>{correctIp}</h2>
            </section>
            <section>
              <h3>Location</h3>
              <h2>{correctLocation}</h2>
            </section>
            <section>
              <h3>Timezone</h3>
              <h2>{correctTimeZone}</h2>
            </section>
            <section>
              <h3>ISP</h3>
              <h2>{correctIsp}</h2>
            </section>
          </div>
        </div>
        <div className ="mapContainer">
          <iframe src={googleMap} ></iframe>
        </div>
      </div>
    );
  }
}

export default App;
