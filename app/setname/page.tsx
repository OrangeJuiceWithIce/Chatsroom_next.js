import {useNavigate} from 'react-router-dom'
import './SetName.css'
function setName(){
    let navigate=useNavigate();

    const handleSubmit=(event:any)=>{
        event.preventDefault();
        const userName=event.target.elements.userName.value;
        navigate(`/chatsroom`,{state:{'userName':userName}});
    }

    return(
        <div className='setNameContainer'>
            <div className='setName'>
                <h1>Set your name here!</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='userName'></label>
                    <input type='text' id='userName'></input>
                    <button type='submit'>提交</button>
                </form>
            </div>
        </div>
    );
}

export default setName;