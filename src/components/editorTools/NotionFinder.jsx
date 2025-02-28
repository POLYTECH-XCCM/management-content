import { CiSearch } from 'react-icons/ci';
import React, { useEffect, useState } from 'react';
import { DOMParser } from 'xmldom';
import NotionSearchCard from './NotionSearchCard/NotionSearchCard';
import { set } from 'mongoose';

const NotionFinder = () => {
  const [notions, setNotions] = useState([]);

  const [xml, setXml] = useState({});

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const parser = new DOMParser();
        setXml({
          documentName: file.name,
          nodeType: 'Gr',
          notionContent: reader.result
        });
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    let tab = [...notions];
    tab.push(xml);
    setNotions(tab);
  }, [xml]);

  return (
    <section className="h-full w-full border-2 rounded-lg p-2 flex flex-col justify-between overflow-hidden">
      <div className="h-12 w-full border gap-2 bg-gray-300 rounded-lg flex items-center pr-2">
        <input
          onChange={handleFileChange}
          type="file"
          className="shadow appearance-none border rounded w-[100%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {notions && (
        <div className="bg-gray-100 w-full h-full m-auto mt-8 p-2 overflow-auto gap-2 flex flex-col" style={{ borderRadius: 8 }}>
          {notions.map((findObject, index) =>
            (findObject.nodeType == undefined || findObject.nodeType == null) ? null : <NotionSearchCard key={index} nodeType={findObject.nodeType} documentName={findObject.documentName} />
          )}
        </div>
      )}
    </section>
  );
};

export default NotionFinder;
