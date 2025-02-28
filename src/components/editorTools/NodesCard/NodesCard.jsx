import React, { useState } from 'react';

function NodesCard(props) {
  const NODEINFOS = [
    {
      nodeType: 'DOC',
      nodeInitial: 'Co',
      nodeColor: '#4285F4',
      textColor: 'white',
      marginLeft: '0px',
      width: '100%'
    },
    {
      nodeType: 'PART',
      nodeInitial: 'Pt',
      nodeColor: '#34A853',
      textColor: 'white',
      marginLeft: '10px',
      width: '90%'
    },
    {
      nodeType: 'CHAPTER',
      nodeInitial: 'Ch',
      nodeColor: '#FBBC05',
      textColor: 'white',
      marginLeft: '20px',
      width: '80%'
    },
    {
      nodeType: 'PARAGRAPH',
      nodeInitial: 'Pr',
      nodeColor: '#EA4335',
      textColor: 'white',
      marginLeft: '30px',
      width: '70%'
    },
    {
      nodeType: 'NOTION',
      nodeInitial: 'No',
      nodeColor: '#E2EBF9',
      textColor: '#4285F4',
      marginLeft: '40px',
      width: '60%'
    }
  ];
  const nodeObject = props.nodeObject;

  const [nodeElement, setNodeElement] = useState(
    nodeObject.nodeType
      ? NODEINFOS.find((node) => node.nodeType === nodeObject.nodeType)
      : {
          nodeType: 'DOC',
          nodeInitial: 'Co',
          nodeColor: '#4285F4',
          textColor: 'white'
        }
  );

  const [nodeTitle, setNodeTitle] = useState(nodeObject.nodeTitle);

  const [isEnterPressed, setIsEnterPressed] = useState(props.isEnterPressed ? props.isEnterPressed : false);

  // ceci est le vrai code ultime
  const nodeStyles = props.nodeObject.isClicked ? (
    {
      bgColor: nodeElement.nodeColor,
      color: 'white',
      textColor: nodeElement.nodeType !== 'NOTION' ? nodeElement.nodeColor : nodeElement.textColor,
      titleColor: nodeElement.nodeType !== 'NOTION' ? 'white' : 'black'
    }
  ) : (
    {
      bgColor: 'white',
      color: nodeElement.nodeColor,
      textColor: nodeElement.textColor,
      titleColor: 'black',
    }
  );


  const handleNodeOnClick = () => {
    props.setSelectedNode({
      index: props.index,
      nodeType: nodeElement.nodeType,
      nodeTitle: nodeTitle,
      parent: nodeObject.parent,
      nodeLevel: nodeObject.nodeLevel,
      htmlContent: nodeObject.htmlContent,
      isClicked: !props.nodeObject.isClicked,
      isEnterPressed: isEnterPressed
    });
  };

  const handleNotionOnEnterPress = (keyPressed) => {
    setIsEnterPressed(!isEnterPressed);
    if (nodeElement.nodeType === 'NOTION' && keyPressed === 'Enter' && !props.nodeObject.isClicked) {
      if (isEnterPressed) {
        const tempNodeObject = {
          index: props.index,
          nodeType: nodeElement.nodeType,
          nodeTitle: nodeTitle,
          parent: nodeObject.parent,
          nodeLevel: nodeObject.nodeLevel,
          htmlContent: nodeObject.htmlContent,
          isClicked: true,
          isEnterPressed: isEnterPressed
        };
        console.log(tempNodeObject);
        props.setEnterPressedNotion(tempNodeObject);
      }
    }
  };

  return (
    <button
      onKeyDown={(e) => handleNotionOnEnterPress(e.key)}
      className="p-[6px] flex flex-row gap-[5px] items-baseline rounded-lg"
      style={{
        width: `${nodeElement.width}`,
        backgroundColor: `${nodeStyles.bgColor}`,
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        marginLeft: `${nodeElement.marginLeft}`
      }}
    >
      <span
        onClick={() => handleNodeOnClick()}
        on
        style={{
          fontWeight: 'bold',
          padding: '2px 5px',
          borderRadius: 100,
          textAlign: 'center',
          backgroundColor: `${nodeStyles.color}`,
          color: `${nodeStyles.textColor}`
        }}
      >
        {nodeElement.nodeInitial}
      </span>
      <input
        className="focus:outline-none break-words w-full hover:break-words"
        style={{ color: `${nodeStyles.titleColor}`, backgroundColor: `${nodeStyles.bgColor}` }}
        value={nodeTitle}
        onChange={(e) => setNodeTitle(e.target.value)}
        onBlur={() =>
          props.updateNode({
            index: props.index,
            nodeType: nodeElement.nodeType,
            nodeTitle: nodeTitle,
            parent: nodeObject.parent,
            nodeLevel: nodeObject.nodeLevel,
            htmlContent: nodeObject.htmlContent,
            isClicked: props.nodeObject.isClicked,
            isEnterPressed: isEnterPressed
          })
        }
      />
    </button>
  );
}

export default NodesCard;
