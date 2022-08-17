// state --> render a new UI --> react updates the DOM
// component take value and returns output ; given same input component will return same output --> predictable STATE AND UI
// UI = f(state)
// render react function component ;
//  render react component --> ReactDOM.render() creates Tree of react component --> Updated to DOM


// before
const MyComponent = props => <div> Hello world</div>
// after
const MyComponentA = props => React.createElement('div', null, "Hello world")

// createElement call creates POJO {type: thingTorender, props: {}, children: []}
// curly braces escapes from JSX back to normal JS EXPRESSION NOT STATEMENT EXPRESSION
// Render logic can render single root element <div>...</div> 
// JSX uses capitalization to differenciate between HTML elements and React compoenents
// if lowercase assumed to be an HTML element and turned into a string. If uppercase tag assumed to be a variable name in scope
// Props are values passed from parent to child. 
// Props are combined into a single object. That props object is the only parameter for function components.
// Props are read only
// Event handler declared in components are automatically managed by React, using "event delegation" to simplify handling and improve performance
// useState hook allow components to store and update value internally after rendering (component to have state)
// useState returns an array with [initialState, setterFunction]; calling setState(value) will queue re-render!
// Rendering should only be based on current props and state
// Render logic must be “pure“, without any “side effects”
// No AJAX calls, mutating data, random values
//Parents pass callbacks to children as props
// children communicate to parent by running props.somethingHappened(data)
// Custom hook, just a function that calls React hooks
// libraries custom hooks ; useSelector, useDispatch, useHistory, useLocation, useParams, useClickOutside, useWindowSize, useFormState
// useRef mutable refObject that persists between renders
// In forms, React forces input to have values based on state,
// "Controlled inputs" must have value prop (reads state) onChange callback that reads event and updates state
// React applies value to input -> User edits input -> Onchange handler updates state -> Rerender with new state -> new state applied to value -> value showed to user 
function (props) {
  const a = props
  props = props + 1 // WRONG
}

function Counter {
  const [counter, setCounter] = useState(1)

  const handleClick = (e) => setCounter(counter + 1)
  
  return (
    <div>
      <span>{counter}</span>
      <button onClick={handleClick}>click me</button>
    </div>
  )
}

function Counters {
  const [timesClicked, setTimesClick] = useState(0);
  const [counters, setCounters] = useState({a:0, b:0})

  const handleCounters = e => {
    setTimesClick(timesClicked + 1);
    setCounters({
      ...counters,
      [name] = counters[name] + 1 
    })
  }


  return (
    <div>
      Button was clicked {timesClicked} times
      <button onClick={handleClick('a')}></button> 
      <button onClick={handleClick('b')}></button> 
    </div>
  )
      }

function Child({speaker, onClick}) {
  return <li onClick={onClick}>li</li>
}

function Parent({speaker}) {
  const [state, setState] = useState('')
  
  const onClick = () => {
    setState()
  }
  
  return (
    <div>
      {speaker.map(s => {
        return (
          <Child key onClick={}/>
        )
      })}
    </div>
  )

  )
}

function FormComponent() {
  const [formFields, setFormFields] = useState({
    firstName: '',
    lastName: ''
  })

  const {firstName, lastName} = formFields

  const onFieldChanged = e => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value
    })
  }

  const onJediChanged = e => {
    setIsJedi(e.target.checked)
  }
  
  let description = "";

  if (firstName && lastName) {
    description = `(${isJedi ? 'Jedi' : 'Not Jedi'})`
  }

  return(
    <form >

      <div>
        <label>First Name:</label>
        <input 
          name="firstName"
          type="text" 
          value={firstName}
          onchange={onFieldChanged}
        />
      </div>

      <div>
        <label htmlFor="">Last Name:</label>
        <input type="text" name="lastName" value={lastName} onchange={onFieldChanged}/>
      </div>

      <div>
        <label htmlFor="">is Jedi</label>
        <input type="checkbox" name="jedi" id="" value={isJedi} onChange={onJediChanged}/>
      </div>
      <div>
        <label htmlFor="">Result</label>
        <span>{firstName} {lastName} {description}</span>
      </div>
    </form>


  )
 }