var pointsRoute = [];
/////////// Container for map element
class Map extends React.Component {
  render() {
    return (
      <div id="map">
      </div>
    );
  }
}
///!!!

/////////// Route point element
class Line__point extends React.Component {
  render() {
    return (
      <p className="line__point" >
        {this.props.point}
      </p>
    );
  }
}
///!!!

/////////// Element for remove route point
class Line__remove extends React.Component {
  constructor(props)
  {
    super(props);
    this.onIDPoit =this.onIDPoit.bind(this);
  }
  onIDPoit(e)
  {
    this.props.onIdNumberPoint(e.target.id);
  }
  render() {
    return (
      <div className="line__remove" id={this.props.orderNumber}  onClick={this.onIDPoit}></div>
    );
  }
}
///!!!

/////////// Element for adding new route point
class Line extends React.Component {
  constructor(props)
  {
    super(props);
    this.onSendIdPoint = this.onSendIdPoint.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }
  onStart(e)
  {
    this.props.onDragStart(e,e.target.id);
  }
  onMove(e)
  {
    //console.log(e.offsetParent);
  }
  onEnd(e)
  {
    this.props.onDragStop(0);
  }
  onSendIdPoint(id)
  {
    this.props.onSendIdentifierPoint(id);
  }
  render() {
    return (
      <div className="line" 
           draggable 
           onDragStart={this.onStart} 
           id={this.props.number+"draggableElement:"} 
           onDrag={this.onMove}
           onDragEnd={this.onEnd}
           >
        <Line__point point={this.props.text}/>
        <Line__remove orderNumber={this.props.number} onIdNumberPoint={this.onSendIdPoint}/>
      </div>
    );
  }
}
///!!!

/////////// Text input
class Editor__text extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {value:''};
    this.onValuePoint = this.onValuePoint.bind(this);
    this.onCallElementAddress = this.onCallElementAddress.bind(this);
  }
  onValuePoint(e){
    if( (e.which == 13) || (e.target.className == "editor__similar-addresses")) 
    {
      var textInput = document.querySelector(".editor__text");
      this.props.onSendPoint(textInput.value);
      textInput.value='';
      this.setState({value:''});
    }
  }
  onCallElementAddress(e){
    this.setState({value:e.target.value}); 
  }
  render() {
    var selectorAddress =  (this.state.value.length > 0) ? "editor__similar-addresses" : "editor__similar-addresses_hidden";
    return (
      <div className="address">
        <input className="editor__text" placeholder="Введите адрес" onChange={this.onCallElementAddress} onKeyPress={this.onValuePoint}/>
        <p className={selectorAddress} onClick={this.onValuePoint} > {this.state.value} </p>
      </div>
    );
  }
}
///!!!

/////////// Storage box for route editor items
class Editor extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {points:[]}
    this.onNewPoint = this.onNewPoint.bind(this);
    this.onDeletePoint = this.onDeletePoint.bind(this);
    this.redrawPoints = this.redrawPoints.bind(this);
  }
  onNewPoint(point)
  {
    if(point.length > 0)
    {
      var saveArray = this.state.points;
      saveArray.push(point);
      this.setState({points : saveArray});
    }
    pointsRoute = saveArray;
    check();
  }
  onDeletePoint(index)
  {
    if(this.state.points.length > 0)
    {
      var deletePoint = this.state.points;
      deletePoint.splice(index,1);
      this.setState({points : deletePoint});
      pointsRoute = deletePoint;
      console.log("deletePoint - "+deletePoint+" pointsRoute - "+pointsRoute);
      check();
    }
  }
  redrawPoints(points)
  {
    this.setState({points});
    pointsRoute = points;
    check();
  }
  render() {
    return (
      <div className="editor">
      	<Editor__text onSendPoint={this.onNewPoint}/>
        <Editor__points  text={this.state.points} onSendIndexPoint={this.onDeletePoint} onNewArrayPoints={this.redrawPoints}/>
      </div>
    );
  }
}
///!!!

/////////// Common block
class Editor__points extends React.Component {
  constructor(props)
  {
    super(props);
    this.onSendNumberPoint = this.onSendNumberPoint.bind(this);
    this.onBegin = this.onBegin.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onDropEnd = this.onDropEnd.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.state = {
      move:0,
      index:null,
      id:null
    }
  }
  onMouseMove(e)
  {
    if( (this.state.move == 1) && !isNaN(parseInt(e.target.id)) )
    {
      this.setState( {index:parseInt(e.target.id)} );
    }
  }
  onDropEnd(n)
  {
    var newText = this.props.text, id = this.state.id, index =  this.state.index;
    newText.splice(index, 0, newText[id]);
    if(id > index)
    {
      newText.splice(id+1, 1);
    }
    else
    {
      newText.splice(id, 1);
      newText.splice(0, 0, newText[newText.length-1]);
      newText.splice(newText.length-1, 1);

    }
    this.props.onNewArrayPoints(newText);
  }
  onBegin(ev,id)
  {
    this.setState({move:1});
    ev.dataTransfer.setData("id",id);
    this.setState({id:parseInt(ev.dataTransfer.getData("id"))});

  }
  onSendNumberPoint(id)
  {
    this.props.onSendIndexPoint(Number(id));
  }
  onDragOver(e)
  {
    e.preventDefault();
  }
  render() {
    let line = this.props.text.map( (values, index) => <Line text={values} number={index} onDragStart={this.onBegin} onDragStop={this.onDropEnd} onSendIdentifierPoint = {this.onSendNumberPoint}/>);
    return (
      <div className="editor__points" onDragEnter={this.onMouseMove} onDragOver={this.onDragOver}>
        {line}        
      </div>
    );
  }
}
///!!!

//end//////// Common block
class Router extends React.Component {
  render() {
    return (
      <div className="router">
      	<Editor/>
      	<Map/>
      </div>
    );
  }
}
//end!!!
ReactDOM.render(<Router />, document.getElementById('root'));

function check()
{
   var  orderInex = [];
  if(pointsRoute.length > 2)
  {
    orderInex = pointsRoute.slice(1,pointsRoute.length-1).map( (value, index) => (index+1) );
  }
  ymaps.ready(function () 
            {
                myMap.geoObjects.removeAll();
                var multiRoute = 
                    new ymaps.multiRouter.MultiRoute(
                      {   
                          referencePoints: pointsRoute,
                          params: 
                          {
                                viaIndexes: orderInex
                          }
                      }
                      ,{
                        boundsAutoApply: true
                      }
                  );
                multiRoute.editor.start();
                myMap.geoObjects.add(multiRoute);
          }
  );
}
var myMap; 
ymaps.ready(
          function () 
          {
            function showMap(geoPosition)
            {
              myMap = 
                    new ymaps.Map('map', 
                      {
                        center: geoPosition,
                        zoom: 9,
                        controls: []
                      }
                    );  
            }
            navigator.geolocation.getCurrentPosition( (position) =>
                {  
                    showMap([position.coords.latitude, position.coords.longitude])
                } , (error) => {
                     if(error.code == 1)
                     {
                        showMap([55.751574, 37.573856]);
                     }
            }); 
            
        }
);

