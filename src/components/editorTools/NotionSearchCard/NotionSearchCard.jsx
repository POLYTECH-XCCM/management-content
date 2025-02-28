import React, { useState } from 'react';
import styles from './NotionSearchCard.module.css';

function NotionSearchCard({ documentName, nodeType }) {
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

  return (
    <button
      className="p-[6px] flex flex-row gap-[5px] items-baseline rounded-lg"
      style={{
        width: `100%`,
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)'
      }}
    >
      <span
        style={{
          color: 'black',
          fontWeight: 'bold',
          padding: '2px 5px',
          borderRadius: 100,
          textAlign: 'center',
          backgroundColor: `#E8EBF1`
        }}
      >
        {nodeType}
      </span>
      <span>{documentName}</span>
    </button>
  );
}

export default NotionSearchCard;
