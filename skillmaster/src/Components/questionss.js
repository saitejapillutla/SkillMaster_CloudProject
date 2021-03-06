import React,{Component} from 'react'
import { useContext } from 'react';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../Components/question.css'
import { UserContext } from "../providers/UserProvider";
import firebase from "firebase/app";
import { auth } from "../firebase"
require('firebase/auth');
require('firebase/database');

class Questionss extends Component{
    static contextType = UserContext;
    
    constructor(props){
        super(props);
        this.state={
            question:'',
            imgUrl:'',
            hint1:'',
            hint2:'',
            hint01:'',
            hint02:'',
            hintO:false,
            hintT:false,
            uid:'',
            email:'',
            name:'',
            time:'',
            user:'',
            key:'',
            thanks:false,
            subject:'',
            set:'',
            hntbtn:"Let's see a hint",
            questionUrl:'',
            applied:true,
            coins:'100',
            exit:false
        }
        
    }

componentDidMount(){
    let names =""
    let question=""
    let imgUrl=""
    let key=""
    auth.onAuthStateChanged(userAuth => {

        names=userAuth.displayName
        this.setState({ user: userAuth });
        this.setState({ name: names });
        this.setState({ key: "0" });
        this.loadques()
        
      });
}


timer=()=>{

let time =parseInt( this.state.time)
const interval = setInterval(() => {
    time=time-20
    const ferr=firebase.database().ref('scavanger/RegisteredTeam/'+this.state.key)
    ferr.update({
            time:time
    }).then((er)=>{
        this.setState({time :time})
    console.log("helloss")
    })
}, 20000);
}





   

    

loadques=()=>{     
        var key =this.props.match.params.id

        let set=""
        console.log(key)
        this.setState({ key: key });
        const sett=firebase.database().ref('scavanger/RegisteredTeam/'+key+'/')
        sett.once("value").then((setno)=>{
            if(setno.val().set!=null){
             set=setno.val().set
            this.setState({ set: set });
            let coins=setno.val().coins
            this.setState({ coins: coins });

            let time=setno.val().time
            this.setState({ time: time });




            }}).then((error)=>{


            const Questio =firebase.database().ref('questions/set'+set+'/')
            Questio.once("value").then((ques)=>{
                this.setState({ question: ques.val().questionThree });
                this.setState({ questionUrl: ques.val().questionThreeimageURL });
                this.setState({ hint01: ques.val().hintThreeOne });
                this.setState({ hint02: ques.val().hintThreeTwo });
                this.timer()
            })

            })        
        }


        
 reducecoin=(event)=>{
    
    
    let coi=0
    const coin=firebase.database().ref('scavanger/RegisteredTeam/'+this.state.key+'/coins')
    coin.once("value").then((ques)=>{
        coi=parseInt(ques.val())
        console.log(ques.val())
    }).then((error)=>{
        if(coi>=10){

        
        coi=coi-10;
        this.setState({coins : coi})
        const setUp=firebase.database().ref('scavanger/RegisteredTeam/'+this.state.key+'/')
        setUp.update(
                {
                    coins:coi
                }).then((error)=>{
                    if(!this.state.hintO){
                        
                    let vd =this.state.hint01
                    console.log(vd)
                    this.setState({ hint1:  vd});
                    this.setState({ hintO:  true});
                    console.log(this.state.hint1)
                    }else {
                        
                        let vd =this.state.hint02
                        console.log(vd)
                        this.setState({ hint2:  vd});
                        this.setState({ hntbtn:  ""});
                        console.log(this.state.hint2)

                        }
                })
    }}
    
    )}






handleSubmit=(event)=>{
    
    event.preventDefault();
    let ans =this.state.subject

    const coin=firebase.database().ref('scavanger/RegisteredTeam/'+this.state.key+'/')
    coin.update({
        AnswerThree:ans
    }).then((error)=>{
        
        this.setState({ thanks:  true});
    })
}
handleSubjectChange=(event)=>{
    this.setState({
        subject:event.target.value
    });
}
    render(){

        if(this.state.time>=0){
        return this.state.thanks ?<Redirect to="/thanks"/>: (
            <>
                            <section className="row m-5 pt-5">
                               <div className="row col-sm-11">
                            <div className ="row justify-content-center">
                                
                                 <div><h1 className="whitefont italic glass p-2 px-5">Here is Your Last Riddle {this.state.name}</h1></div>
                                 </div>
                                 <div className ="row justify-content-center">
                                    
                                 <div className="my-3 qglass  px-5">
                                     <h3 className="whitefont">{this.state.question}</h3></div>
                                     <img className="round" src={this.state.questionUrl}/>
                                 </div>
                                 
             
                                
                             </div>
                             <div className="mx-0 px-0 col-sm-1 ">
                                 <div className="glass p-3">
                             <h1 className="whitefont italic ">Wallet</h1>
                             <div className="row px-2">
                             <div><h5 className="whitefont">{this.state.coins}</h5></div>
            
                             <div className="coins"></div>
                             </div>
                             
                             
                             </div>
                             <h1 className="whitefont italic ">{this.state.time} secs left</h1>
                            
                             </div>
                             </section>
                             <div className =" mx-5 px-5 justify-content-center">
                                 <div className="mt-5">
                                     <h1 className="whitefont p-2 qglass">{this.state.hint1}</h1>
                                     <h1 className="whitefont p-2 qglass">{this.state.hint2}</h1>
                                    
                                   
                                         
                                   
                                   
                                    
                                </div><div className ="row align-items-end">
                                         <Link onClick={this.reducecoin}  className="btn effect01 my-4" ><span>{this.state.hntbtn}</span></Link> 
                                         </div>
                                 </div>

                             <section className="my-5 mx-5 py-5">

                                    <div className="my-5 mx-5 px-4 glass py-5">
                                        <div>
                                            <form  onSubmit={this.handleSubmit}>
                                            <div className="mt-4">
                        <label className="whitefont">Enter your Final Answer ::</label>
                        <div className="inputborder p-2">
                             <input class="myinput" value={this.state.subject} onChange={this.handleSubjectChange} type="text" name="subject"  placeholder="Your Answer">
                                 </input>
                        </div>
                        <button type="submit" class="btn effect01 ">Send</button>
                        <Link to={this.state.thanks}></Link>
                        </div>
                                            </form>





                                        </div>
                                    </div>
                             </section>
                         </>
        )} else  {return <Redirect to="/thanks"/>}
    
    }

}
export default Questionss