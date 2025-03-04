// function Courses({title, description, children}){
    function Courses(props){
    return (
    <>
    <h2>Title : {props.title}</h2>
    <p>Description : {props.description}</p>
    <p>{props.children}</p>
    </>)
}

export default Courses;