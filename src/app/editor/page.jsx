"use client";
import {
  Button,
  Card,
  Drawer,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemSuffix,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@material-tailwind/react";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
//import officegen from 'officegen'

import Chat from "@/components/Chat/Chat";
import AIBotMenu from "@/components/editorTools/AiBotMenu/AIBotMenu";
import CreateDocx from "../../pdfDocument/docxConvert";
import CreatePdf from "../../pdfDocument/pdfConvert";
import { getDocumentsByAuthor } from "../api/Doc/route";
import { X } from "lucide-react"; // Import de l'icône croix


const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import { Dialog, Flex, Inset, Separator, Spinner, Text, TextField } from "@radix-ui/themes";

import { Header, NodesCard, NotionFinder, RichTextEditor } from "@/components/editorTools";
import { ThemeToggle } from "@/components/ThemeToggle";
import axios from "axios";

import { quillFormats, quillModules } from "./quillConfig";
import { toast } from "react-toastify";
import { useGenerateTextWithAI } from "@/hooks/use-generate-text-with-ai";
import { replaceHTML } from "@/lib/html";
import { useTheme } from "next-themes";

var SORTEDTOC;

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}


async function addElementToDoc(currentFileName, sortedTOC) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch("/api/Doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: currentFileName,
          emptyTOC: sortedTOC,
          email: "fogangzacharietene@gmail.com",
        }),
      });

      resolve(true);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function CreationEditor() {

  const [FilesList, setFilesList] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // État pour contrôler la boîte de dialogue
  const [fileToDeleteIndex, setFileToDeleteIndex] = useState(null); // Index du fichier à supprimer

  const confirmDeleteFile = () => {
    if (fileToDeleteIndex !== null) {
      const updatedFilesList = FilesList.filter((_, index) => index !== fileToDeleteIndex); // Supprimez l'élément
      setFilesList(updatedFilesList); // Mettez à jour l'état
      localStorage.setItem("FilesList", JSON.stringify(updatedFilesList)); // Mettez à jour le localStorage
      toast.success("Fichier supprimé avec succès"); // Notification de succès
    }
    closeDeleteDialog(); // Fermez la boîte de dialogue
  };
  
  const openDeleteDialog = (index) => {
    setFileToDeleteIndex(index); // Sauvegardez l'index du fichier à supprimer
    setIsDeleteDialogOpen(true); // Ouvrez la boîte de dialogue
  };
  
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setFileToDeleteIndex(null);
  };

  

  useEffect(() => {
    getDocumentsByAuthor("fogangzacharietene@gmail.com")
      .then((documents) => {
        console.log("Documents retrieved successfully:", documents);
      })
      .catch((error) => {
        console.error("An error occurred while retrieving the documents:", error);
      });
  }, []);

  const [isModalActive, setIsModalActive] = useState(false);
  const [isNodeTitleModalActive, setIsNodeTitleActive] = useState(false);
  const [isNotionEditorActive, setIsNotionEditorActive] = useState(false);
  const [renderingHtml, setRenderingHtml] = useState("");
  const [tableOfContents, setTableOfcontents] = useState([
    {
      nodeType: "DOC",
      nodeTitle: "Titre de cours",
      nodeLevel: "Co0",
      parent: undefined,
      htmlContent: "",
      isClicked: false,
      isEnterPressed: false,
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [tableOfContentsComponents, setTableOfContentsComponents] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [enterPressedNotion, setEnterPressedNotion] = useState(null);

  //const sampleHTML = '<p>Alfred Hetsron Yepnjio</p><ul><li><strong>Sample</strong></li></ul><ol type="1"><li>you</li></ol><ul><li>content</li><li>state</li></ul><p></p>'
  const [htmlEditorContent, setHtmlEditorContent] = useState(null);
  const [newHTMLContent, setNewHTMLContent] = useState(null);
  const [defaultDraftHTML, setDefaultDraftHTML] = useState("");
  const [jsonEditorContent, setJsonEditorContent] = useState(null);

  const [addNodeOptions, setAddNodeOptions] = useState([]);
  const [addNodeInfo, setAddNodeInfo] = useState(null);
  const [addNodeTitle, setAddNodeTitle] = useState("");

  const quillEditorSelectionRef = useRef(null);
  const [selectedText, setSelectedText] = useState("");

  const handlecloseEditor = () => {
    updateNotionHTMLInTOC(DOMPurify.sanitize(htmlEditorContent));
    setIsNotionEditorActive(false);
  };
  const parseStringToHTML = (htmlString) => {
    const parser = new DOMParser();
    const parsedHTML = parser.parseFromString(htmlString, "text/html");
    return parsedHTML.body;
  };

  const setEnterPressNotionInTOC = (nodeInfo) => {
    setEnterPressedNotion(nodeInfo);
    // console.log(nodeInfo.htmlContent);
    setDefaultDraftHTML(nodeInfo.htmlContent);
    if (nodeInfo) {
      let tempTOC = [...tableOfContents];
      setTableOfcontents([]);
      tempTOC = tempTOC.map((item, index) => {
        item.isClicked = false;
        item.isEnterPressed = false;

        return item;
      });
      tempTOC[nodeInfo.index].isClicked = nodeInfo.isClicked;
      tempTOC[nodeInfo.index].isEnterPressed = nodeInfo.isEnterPressed;
      setTableOfcontents(tempTOC);

      /* We Display the Editor if all condiions satisfy*/
      setIsNotionEditorActive(true);
    }
  };

  const setSelectedNodeInTOC = (nodeInfo) => {
    setSelectedNode(nodeInfo);

    let tempTOC = tableOfContents.map((item) => {
      return {
        ...item,
        isClicked: false,
        isEnterPressed: false,
      };
    });

    if (nodeInfo) {
      console.log("selected", nodeInfo.isClicked, nodeInfo.index);
      //setTableOfcontents([]);
      tempTOC[nodeInfo.index].isClicked = nodeInfo.isClicked;
      tempTOC[nodeInfo.index].isEnterPressed = nodeInfo.isEnterPressed;
    }

    setTableOfcontents(tempTOC);
  };

  const updateEditedNodeTitle = (nodeInfo) => {
    if (nodeInfo) {
      setSelectedNode(nodeInfo);
      let tempTOC = [...tableOfContents];
      setTableOfcontents([]);
      tempTOC[nodeInfo.index].nodeTitle = nodeInfo.nodeTitle;
      setTableOfcontents(tempTOC);
    }
  };

  const updateNotionHTMLInTOC = (htmlString) => {
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    tempTOC[enterPressedNotion.index].htmlContent = htmlString;
    setTableOfcontents(tempTOC);
  };

  const setAddNodeTypes = (selectedNode) => {
    switch (selectedNode.nodeType) {
      case "DOC":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
          {
            nodeType: "PARAGRAPH",
            nodeInitial: "Pr",
            nodeColor: "#EA4335",
            textColor: "white",
          },
          {
            nodeType: "PART",
            nodeInitial: "Pt",
            nodeColor: "#34A853",
            textColor: "white",
          },
        ]);
        break;
      case "PART":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
          {
            nodeType: "PARAGRAPH",
            nodeInitial: "Pr",
            nodeColor: "#EA4335",
            textColor: "white",
          },
          {
            nodeType: "CHAPTER",
            nodeInitial: "Ch",
            nodeColor: "#FBBC05",
            textColor: "white",
          },
        ]);
        break;
      case "CHAPTER":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
          {
            nodeType: "PARAGRAPH",
            nodeInitial: "Pr",
            nodeColor: "#EA4335",
            textColor: "white",
          },
        ]);
        break;
      case "PARAGRAPH":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
        ]);
        break;
      default:
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
        ]);
        break;
    }
  };

  const insertElementAtPosition = (array, element, index) => {
    const newArray = [...array];
    newArray.splice(index, 0, element);
    return newArray;
  };

  const handleOpenAddNodeModal = () => {
    if (selectedNode && selectedNode.isClicked) {
      setIsModalActive(true);
      setAddNodeTypes(selectedNode);
    }
  };

  const handleDeleteFile = (index) => {
    const updatedFilesList = FilesList.filter((_, i) => i !== index); // Supprimer le fichier
    setFilesList(updatedFilesList); // Mettre à jour la liste des fichiers
    localStorage.setItem("FilesList", JSON.stringify(updatedFilesList)); // Mettre à jour le localStorage
    toast.success("Fichier supprimé avec succès"); // Notification de succès
  };

  const handleDeleteNodeModal = () => {
  // Cette fonction devrait être appelée lorsque l'utilisateur clique sur le bouton de suppression
  if (selectedNode) {
    openDeleteDialog(selectedNode.index); // Ouvrir la boîte de dialogue de confirmation
  }
};

const confirmDeleteNode = () => {
  if (selectedNode) {
    let tab = [...tableOfContents];
    let tabTampon = [];
    tabTampon.push(selectedNode);
    setSelectedNode(null);

    for (let i = 0; i < tabTampon.length; i++) {
      for (let j = 0; j < tab.length; j++) {
        if (tab[j].parent === tabTampon[i].nodeLevel && !tabTampon.includes(tab[j])) {
          tabTampon.push(tab[j]);
        }
      }
    }

    for (let i = 0; i < tabTampon.length; i++) {
      for (let j = 0; j < tab.length; j++) {
        if (tab[j].nodeLevel === tabTampon[i].nodeLevel) {
          tab.splice(j, 1);
        }
      }
    }

    setTableOfcontents(tab); // Mettre à jour les tableOfContents après suppression
    toast.success("Nœud supprimé avec succès !"); // Notification de succès
  }
  closeDeleteDialog(); // Fermer la boîte de dialogue
};

// Dans le code de la boîte de dialogue, assurez-vous d'appeler confirmDeleteNode lors de la confirmation

  const handleOpenAddTitleModal = (nodeInfo) => {
    setAddNodeInfo(nodeInfo);
    setIsNodeTitleActive(true);
  };
  const handleExitModal = () => {
    setSelectedNode(null);
    setIsModalActive(false);
    setIsNodeTitleActive(false);
    setAddNodeOptions([]);
    setAddNodeInfo(null);
    setAddNodeTitle("");
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    setTableOfContentsComponents([]);
    setTableOfcontents(tempTOC);
  };

  function generateHTMLFromGraph(graph) {
    let htmlString = "";

    function generateNodeHTML(node) {
      let nodeHTML = "";

      switch (node.nodeType) {
        case "DOC":
          nodeHTML += `<div class="node" data-node-type="DOC">
                <h1 class="node-doc">${node.nodeTitle}</h1>`;
          break;
        case "PART":
          nodeHTML += `<div class="node" data-node-type="PART">
                <h2 class="node-part">${node.nodeTitle}</h2>`;
          break;
        case "CHAPTER":
          nodeHTML += `<div class="node" data-node-type="CHAPTER">
                <h3 class="node-chapter">${node.nodeTitle}</h3>`;
          break;
        case "PARAGRAPH":
          nodeHTML += `<div class="node" data-node-type="PARAGRAPH">
                <h4 class="node-paragraph">${node.nodeTitle}</h4>`;
          break;
        case "NOTION":
          nodeHTML += `<div class="node" data-node-type="NOTION">
                <h5 class="node-notion">${node.nodeTitle}</h5>
                <p class="notion-body">${node.htmlContent}</p>`;
          break;
        default:
          break;
      }

      const children = graph.filter((n) => n.parent === node.nodeLevel);
      if (children.length > 0) {
        nodeHTML += '<div class="node-children">';
        children.forEach((child) => {
          nodeHTML += generateNodeHTML(child);
        });
        nodeHTML += "</div>";
      }

      nodeHTML += "</div>";

      return nodeHTML;
    }

    if (graph && graph.length > 0) {
      const root = graph.find((n) => n.parent === undefined);
      if (root) {
        htmlString = generateNodeHTML(root);
      }
    }

    return htmlString;
  }
  const sortTOC = (newTable) => {
    const newTOC = [...newTable];
    const emptyTOC = [];
    //search for the three root: {DOC}
    for (let i = 0, c = newTOC.length; i < c; i++) {
      if (newTOC[i].parent === undefined) {
        emptyTOC.push(newTOC[i]);
        i = newTOC.length;
      }
    }
    //console.log(emptyTOC)
    const filtered = findChildIndexArrayInTOC(newTOC[0], newTable);
    // console.log(filtered);
    //search for the direct children of each node
    for (let i = 0, c = newTOC.length; i < c; i++) {
      const children = findChildIndexArrayInTOC(newTOC[i].nodeLevel, newTable);
      const subTab = [];
      for (let j = 0, d = children.length; j < d; j++) {
        if (!emptyTOC.includes(children[j])) {
          subTab.push(children[j]);
        }
      }
      const indexOfNode = emptyTOC.indexOf(newTOC[i]);
      emptyTOC.splice(indexOfNode + 1, 0, ...subTab);
      // console.log(emptyTOC);
    }
    console.log(emptyTOC);
    return emptyTOC;
  };
  const InsertionSort = (tab) => {
    //nombre des éléments dans le tableau
    var len = tab.length;
    var tmp, i, j;

    for (i = 1; i < len; i++) {
      //stocker la valeur actuelle
      tmp = tab[i];
      j = i - 1;
      while (
        j >= 0 &&
        Number.parseInt(tab[j].nodeLevel[tab[j].nodeLevel.length - 1]) >
        Number.parseInt(tmp.nodeLevel[tmp.nodeLevel.length - 1])
      ) {
        // déplacer le nombre
        tab[j + 1] = tab[j];
        j--;
      }
      //Insère la valeur temporaire à la position
      //correcte dans la partie triée.
      tab[j + 1] = tmp;
    }
    return tab;
  };
  const findChildIndexArrayInTOC = (parentNodeLevel, newTable) => {
    let tempTOC = [...newTable];
    let newChildren = [];
    for (let i = 0, c = tempTOC.length; i < c; i++) {
      if (tempTOC[i].parent !== undefined && tempTOC[i].parent === parentNodeLevel) {
        newChildren.push(tempTOC[i]);
      }
    }
    newChildren = InsertionSort(newChildren);
    // console.log(newChildren);
    return newChildren;
  };
  const handleAddNewNodeToTOC = (nodeTitle) => {
    setAddNodeTitle(nodeTitle);
    /* Add to TOC Logic Here */
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    setTableOfContentsComponents([]);
    tempTOC[selectedNode.index].isClicked = false;
    const newNode = {
      nodeType: addNodeInfo.nodeType,
      nodeTitle: nodeTitle,
      nodeLevel:
        selectedNode.nodeType !== "NOTION"
          ? `${addNodeInfo.nodeInitial}${tempTOC.length}`
          : `${selectedNode.nodeLevel}${tempTOC.length}`,
      parent: `${selectedNode.nodeLevel}`,
      htmlContent: "",
      isClicked: false,
      isEnterPressed: false,
    };
    const newTOC = insertElementAtPosition(tempTOC, newNode, selectedNode.index + 1);
    const sortedTOC = sortTOC(newTOC);
    SORTEDTOC = sortedTOC;
    addElementToDoc(currentFileName, sortedTOC).then((data) => { });
    setTableOfcontents(sortedTOC);
    /* before the code bellow */
    setSelectedNode(null);
    setIsModalActive(false);
    setIsNodeTitleActive(false);
    setAddNodeOptions([]);
    setAddNodeInfo(null);
    setAddNodeTitle("");
  };

  const buildLeftCorner = (newTable) => {
    const leftCornerContent = [];
    for (let index = 0, c = newTable.length; index < c; index++) {
      leftCornerContent.push(
        <NodesCard
          key={index}
          index={index}
          nodeObject={newTable[index]}
          updateNode={updateEditedNodeTitle}
          setSelectedNode={setSelectedNodeInTOC}
          setEnterPressedNotion={setEnterPressNotionInTOC}
        />
      );
    }
    setTableOfContentsComponents(leftCornerContent);
  };

  const generateWordDocument = async () => {
    const response = await axios.post("/api/generate/word", {
      tableOfContents,
    });
    const { data } = response;
    // console.log(data);
  };

  useEffect(() => {
    if (newHTMLContent !== htmlEditorContent) {
      setNewHTMLContent(htmlEditorContent);
      //targetHTMLParseRef.current.innerHTML = ''
      const parsedHTML = parseStringToHTML(`${htmlEditorContent}`);
      //targetHTMLParseRef.current.appendChild(parsedHTML);
    }
  }, [newHTMLContent, htmlEditorContent]);

  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [currentFileName, setcurrentFileName] = useState("");
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  useEffect(() => {
    const renderingHtml = generateHTMLFromGraph(tableOfContents);
    setRenderingHtml(renderingHtml);
    buildLeftCorner(tableOfContents);
    selectedNode ? setContent(selectedNode.htmlContent) : setContent("");
    tableOfContents[1] ? localStorage.setItem("currentFile", JSON.stringify(tableOfContents)) : "";
  }, [tableOfContents]);

  useEffect(() => {
    currentFileName === undefined || currentFileName === ""
      ? ""
      : localStorage.setItem("currentFileName", currentFileName);
  }, [currentFileName]);

  useEffect(() => {
    let currentTableOfContents = JSON.parse(localStorage.getItem("currentFile"));
    let currentFileName = localStorage.getItem("currentFileName");
    currentTableOfContents ? setTableOfcontents(currentTableOfContents) : "";
    currentFileName ? setcurrentFileName(currentFileName) : "";
  }, []);

  const handleEditorChange = (newContent) => {
    selectedNode ? (selectedNode.htmlContent = newContent) : "";
    let tab = [...tableOfContents];
    selectedNode ? (tab[selectedNode.index].htmlContent = newContent) : "";
    setTableOfcontents(tab);
    setContent(newContent);
  };

  const handleCreateDocx = () => {
    let docx = "";
    let i;
    for (i = 0; i < tableOfContents.length; i++) {
      if (tableOfContents[i].htmlContent !== undefined) {
        docx = docx + `<p>${tableOfContents[i].nodeTitle}</p>`;
        docx = docx + tableOfContents[i].htmlContent;
      }
    }
    CreateDocx(docx, `./public/docxFile/${currentFileName}.docx`);

    setTimeout(() => {
      const downloadUrl = `/docxFile/${currentFileName}.docx`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${currentFileName}.docx`;
      link.click();
    }, 1000);
  };

  const handleCreatePdf = () => {
    let pdf = "";
    let i;
    for (i = 0; i < tableOfContents.length; i++) {
      if (tableOfContents[i].htmlContent !== undefined) {
        pdf = pdf + `<p>${tableOfContents[i].nodeTitle}</p>`;
        pdf = pdf + tableOfContents[i].htmlContent;
        console.log(tableOfContents);
      }
    }
    CreatePdf(pdf, `./public/pdfFile/${currentFileName}.pdf`);

    setTimeout(() => {
      const downloadUrl = `/pdfFile/${currentFileName}.pdf`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${currentFileName}.pdf`;
      link.click();
    }, 1000);
  };

  const handleOpenPdf = () => {
    let pdf = "";
    let i;
    for (i = 0; i < tableOfContents.length; i++) {
      if (tableOfContents[i].htmlContent !== undefined) {
        pdf = pdf + `<p>${tableOfContents[i].nodeTitle}</p>`;
        pdf = pdf + tableOfContents[i].htmlContent;
        console.log(tableOfContents);
      }
    }
    CreatePdf(pdf, `./public/pdfFile/${currentFileName}.pdf`);
    setTimeout(() => {
      window.open(`./pdfFile/${currentFileName}.pdf`);
    }, 1000);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleCurrrentFileNameChange = (event) => {
    let tab = [...FilesList];
    let saveValue = event.target.value;
    tab[currentFileIndex] = saveValue;
    setcurrentFileName(saveValue);
    setFilesList(tab);
  };

  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const addFileToList = () => {
    let tab = [...FilesList];
    tab.push(fileName);
    console.log(tab);
    openDrawer();
    setcurrentFileName(fileName);
    setFileName(null);
    setFilesList(tab);
  };

  const changeCurrentFileIndex = (index) => {
    setCurrentFileIndex(index);
  };

  const handleSave = (fileName, sortedTOC) => {
    console.log(fileName);
    console.log(sortedTOC);

    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/Doc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emptyTOC: sortedTOC,
            email: "fogangzacharietene@gmail.com",
          }),
        });

        resolve(true);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  // @Henri: Notification qui s'affiche lorsque l'utilisateur essaye d'utiliser la correction ou l'amelioration par IA sans avoir selectionne du texte
  const alertOnAIUsageWithoutSelectText = () =>
    toast("Veuillez selectionner du texte avant de l'ameliorer ou le corriger avec l'IA");

  const { isError, isLoading, generateTextWithAI } = useGenerateTextWithAI();

  const {theme} = useTheme();

  return (
    <div className="overflow-hidden w-full h-screen flex flex-col justify-between items-start">
      <Header />
      <div className="w-full h-16 flex justify-between items-center">
        <Menu className="ml-5 pl-5 mt-2">
          <MenuHandler className="ml-5 pl-5 mt-2">
            <Button>Menu</Button>
          </MenuHandler>
          <MenuList className="z-10">
            <Popover className="z-50" placement="right">
              <PopoverHandler>
                <MenuItem>Nouveau Fichier</MenuItem>
              </PopoverHandler>
              <PopoverContent className="w-96 ml-20">
                <Typography variant="h6" color="blue-gray" className="mb-6">
                  Creer un nouveau fichier
                </Typography>
                <Typography variant="small" color="blue-gray" className="mb-1 font-bold">
                  Nom du fichier
                </Typography>
                <div className="flex gap-2">
                  <Input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    size="lg"
                    placeholder="exemple"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  />
                  <Button
                    variant="gradient"
                    className="flex-shrink-0"
                    onClick={addFileToList || openDrawer}
                  >
                    OK
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <MenuItem onClick={() => openDrawer()}>Ouvrir un projet</MenuItem>
            <MenuItem onClick={() => handleSave(currentFileName, SORTEDTOC)}>Sauvegarder</MenuItem>
            <MenuItem onClick={() => handleOpenPdf()}>Aperçu</MenuItem>
            <MenuItem onClick={() => handleCreateDocx()}>Creer un Docx</MenuItem>
            <MenuItem onClick={() => handleCreatePdf()}>Creer un Pdf</MenuItem>
          </MenuList>
        </Menu>
        <ThemeToggle />
      </div>
      <div className="w-full h-full px-4 pt-4 flex justify-between items-start overflow-hidden">

        {/* the left corner mode */}
        <section className="w-[20%] h-full flex gap-2 flex-col justify-between border-2 rounded-lg overflow-auto p-2 relative">
  <div className="w-full h-full">
    <h1
      className={`p-2 rounded-lg font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-black'} ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}
    >
      Table des Matières
    </h1>
    <div className="!text-left py-[4px] w-full flex flex-col gap-[4px] pb-5">
      {tableOfContentsComponents}
    </div>
  </div>
  {selectedNode && selectedNode.isClicked ? (
    <div className="flex justify-center gap-4 ml-12 h-12 w-12 bottom-0 right-1">
      <span className="h-12 w-12 rounded-full bottom-0 right-1">
        <button
          onClick={() => handleDeleteNodeModal()} // Ouvrir la boîte de dialogue de suppression
          className="bg-red-600 w-12 h-12 rounded-full flex justify-center items-center"
          style={{ borderRadius: 100, color: "white" }}
        >
          <AiOutlineCloseCircle size={50} />
        </button>
      </span>
      <span className="h-12 w-12 rounded-full bottom-0 right-1">
        <button
          onClick={() => handleOpenAddNodeModal()}
          className="w-12 h-12 rounded-full flex justify-center items-center"
          style={{
            backgroundColor: "#4285F4",
            borderRadius: 100,
            color: "white",
          }}
        >
          <AiOutlinePlus size={20} />
        </button>
      </span>
    </div>
  ) : null}

          {isDeleteDialogOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              display: 'flex', // Utiliser flexbox pour centrer
              justifyContent: 'center', // Centrer horizontalement
              alignItems: 'center', // Centrer verticalement
              zIndex: 1000,
            }}>
              <div style={{
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                maxWidth: '400px', 
                width: '90%',
                textAlign: 'center',
              }}>
                <h2 style={{
                  marginBottom: '10px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#333',
                }}>Confirmer la suppression</h2>
                <p style={{
                  marginBottom: '20px',
                  color: '#555',
                }}>Êtes-vous sûr de vouloir supprimer ce nœud ? Cette action est irréversible.</p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between', 
                }}>
                  <button onClick={closeDeleteDialog} style={{
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    backgroundColor: '#EA4335', 
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}>Annuler</button>
                  <button onClick={confirmDeleteNode} style={{
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    backgroundColor: '#4285F4', 
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}>Supprimer</button>
                </div>
              </div>
            </div>
          )}

  {isModalActive ? (
    <div className="modal-background inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80">
      {!isNodeTitleModalActive ? (
        <div className="modal-container">
          {/* New Node Select Modal */}
          <div className="flex justify-between px-2">
            <span className="w-full text-center text-[24px] font-bold">
              Ajoutez Un Sous-Titre Au Titre: {selectedNode.nodeTitle}
            </span>
            <button
              onClick={() => handleExitModal()}
              className="text-[24px] font-bold"
              type="button"
            >
              X
            </button>
          </div>
          <div className="border-2 border-[#4285F4] rounded-lg h-full flex flex-col justify-evenly items-center">
            <span className="capitalize text-[20px] font-bold">
              Selectionez Le Type De Sous-Titre
            </span>
            <div className="flex flex-row justify-evenly w-full">
              {addNodeOptions.map((nodeOption, index) => (
                <button
                  onClick={() => handleOpenAddTitleModal(nodeOption)}
                  key={index}
                  className="p-[8px] flex flex-col gap-[5px] items-center"
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    boxShadow:
                      "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <span
                    className="text-[50px]"
                    style={{
                      width: 100,
                      height: 100,
                      fontWeight: "bold",
                      padding: "8px",
                      borderRadius: 100,
                      textAlign: "center",
                      backgroundColor: `${nodeOption.nodeColor}`,
                      color: `${nodeOption.textColor}`,
                    }}
                  >
                    {nodeOption.nodeInitial}
                  </span>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    {nodeOption.nodeType}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="modal-container">
          {/* New Node Title Input Modal */}
          <div className="flex justify-between px-2">
            <span className="w-full text-center text-[24px] font-bold">
              Ajoutez Un Sous Titre Au Titre : {selectedNode.nodeTitle}
            </span>
            <button
              onClick={() => handleExitModal()}
              className="text-[24px] font-bold"
              type="button"
            >
              X
            </button>
          </div>
          <div className="border-2 border-[#4285F4] rounded-lg h-full flex flex-col justify-evenly items-center">
            <span className="capitalize text-[20px] font-bold">
              Sous-Titre :
            </span>
            <div className="flex flex-col justify-center items-center gap-1 w-full">
              <div className="group">
                <input
                  required=""
                  type="text"
                  className="input"
                  onChange={(e) => setAddNodeTitle(e.target.value)}
                  autoFocus
                />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>N</label>
              </div>
              <div
                className="p-[6px] flex flex-row gap-[5px] items-baseline rounded-lg"
                style={{
                  backgroundColor: "white",
                  boxShadow:
                    "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    padding: "2px 5px",
                    borderRadius: 100,
                    textAlign: "center",
                    backgroundColor: `${addNodeInfo.nodeColor}`,
                    color: `${addNodeInfo.textColor}`,
                  }}
                >
                  {addNodeInfo.nodeInitial}
                </span>
                <span style={{ color: "black" }}>{addNodeTitle}</span>
              </div>
              <button
                onClick={() => handleAddNewNodeToTOC(addNodeTitle)}
                className="capitalize h-12 w-32 text-xl"
                style={{
                  backgroundColor: "#4285F4",
                  borderRadius: 8,
                  color: "white",
                }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null}
</section>

        {/* The Middle Section */}
        <section className="w-[60%] h-full flex flex-col justify-between items-start px-4 pb-1 overflow-hidden">
          <div className="h-16 w-full flex justiy-between items-center">
          <div className="w-full h-12 flex items-center justify-center">
          <h1 className="font-bold text-3xl uppercase">EDITION DE CONTENUS</h1>
        </div>
          </div>
          <div className="w-full relative h-[calc(100%-64px)] overflow-hidden border-[#E2EBF9] px-[2px] border-2 rounded-lg">
            {isNotionEditorActive && (
              <div className="w-full px-4 flex justify-end items-center h-[50px] z-50 border relative">
                <buttton
                  onClick={handlecloseEditor}
                  className="h-8 w-8 absolute right-8 top-14 z-50 flex justify-center items-center border cursor-pointer"
                >
                  <AiOutlineSave size={20} />
                </buttton>
              </div>
            )}
            <div className="w-full h-full overflow-scroll">

              {isNotionEditorActive && (
                <RichTextEditor
                  setHtmlContent={setHtmlEditorContent}
                  setJsonContent={setJsonEditorContent}
                  // defaultText=''
                  defaultHTMLString={defaultDraftHTML}
                />
              )}
              <div className="w-full h-full overflow-hidden bg-white p-4">
              
                <main className="h-full">
                  <div className="flex flex-auto justify-between items-center gap-x-2">
                    <div className="rounded-lg">
                      <Input
                        type="text"
                        label="current file"
                        value={currentFileName}
                        onChange={handleCurrrentFileNameChange}
                      />
                    </div>

                    {isLoading && <Spinner />}

                    <AIBotMenu
                      onCorrect={() => {
                        if (!quillEditorSelectionRef.current)
                          return alertOnAIUsageWithoutSelectText();

                        const { selection, editor } = quillEditorSelectionRef.current;
                        const selectedText = editor
                          .getText()
                          .slice(selection.index, selection.index + selection.length);
                        if (!selectedText) return alertOnAIUsageWithoutSelectText();

                        generateTextWithAI(`Veuillez corriger le texte suivant. Retournez uniquement
                            le texte corrigé. Si vous ne parvenez pas à corriger le texte, renvoyez le texte original sans modification.
                            Texte à corriger : "${selectedText}"`).then((generatedText) => {
                          setContent((content) => {
                            console.log({ content, generatedText, selection });
                            toast("Votre texte a bien été corrigé par l'IA");
                            return replaceHTML(content, generatedText, selection);
                          });
                        });
                      }}
                      onEnhance={() => {
                        if (!quillEditorSelectionRef.current)
                          return alertOnAIUsageWithoutSelectText();

                        const { selection, editor } = quillEditorSelectionRef.current;
                        const selectedText = editor
                          .getText()
                          .slice(selection.index, selection.index + selection.length);
                        if (!selectedText) return alertOnAIUsageWithoutSelectText();

                        generateTextWithAI(`Veuillez améliorer le texte suivant. Retournez uniquement
                            le texte amélioré. Si vous ne parvenez pas à améliorer le texte, renvoyez le texte original sans modification.
                            Texte à améliorer : "${selectedText}"`).then((generatedText) => {
                          setContent((content) => {
                            return replaceHTML(content, generatedText, selection);
                          });

                          toast("Votre texte a bien été amélioré par l'IA");
                        });
                      }}
                      onOpenAssistant={() => setShowModal(true)}
                    />
                  </div>
                  <div className="flex flex-auto justify-center h-full mx-2">
                    <QuillEditor
                      theme="snow"
                      value={content}
                      onChange={handleEditorChange}
                      modules={quillModules}
                      formats={quillFormats}
                      className="w-full h-full mt-5 bg-white"
                      onChangeSelection={(selection, source, editor) => {
                        quillEditorSelectionRef.current = { selection, editor };
                      }}
                    />
                  </div>
                </main>
              </div>
            </div>
          </div>
        </section>

        
        {/* notion finder zone */}
        <div className="w-[20%] h-full">
  <NotionFinder />
</div>
<div>
      <Drawer open={open} onClose={closeDrawer} className="p-4">
        <div className="h-full flex flex-col items-start border-2 rounded-lg overflow-auto">
            <Typography className="mt-4 ml-8 mb-8 pb-4 border-b-2" variant="h2">
              Mes Projets
            </Typography>
            <div className="h-full flex flex-col items-start">
              <Card className="w-50">
              <List>
                {FilesList.map((item, index) => (
                  <ListItem key={index} ripple={false} className="py-1 pr-1 pl-4">
                    <div onClick={() => console.log(FilesList[index])}>{item}</div>
                    <ListItemSuffix>
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={() => openDeleteDialog(index)} 
                      >
                        <TrashIcon />
                      </IconButton>
                    </ListItemSuffix>
                  </ListItem>
                ))}
              </List>
              {isDeleteDialogOpen && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                  display: 'flex', // Utiliser flexbox
                  justifyContent: 'center', // Centrer horizontalement
                  alignItems: 'center', // Centrer verticalement
                  zIndex: 1000,
                }}>
                  <div style={{
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                    maxWidth: '400px', 
                    width: '90%',
                    textAlign: 'center',
                  }}>
                    <h2 style={{
                      marginBottom: '10px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#333',
                    }}>Confirmer la suppression</h2>
                    <p style={{
                      marginBottom: '20px',
                      color: '#555',
                    }}>Êtes-vous sûr de vouloir supprimer ce fichier ?</p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between', 
                    }}>
                      <button onClick={closeDeleteDialog} style={{
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        backgroundColor: '#EA4335', 
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                      }}>Annuler</button>
                      <button onClick={confirmDeleteFile} style={{
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        backgroundColor: '#4285F4', 
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                      }}>Supprimer</button>
                    </div>
                  </div>
                </div>
              )}
              </Card>
            </div>
          </div>
        </Drawer>
      </div>        
    </div>

<Dialog.Root open={showModal} onOpenChange={(open) => setShowModal(open)}>
  <Dialog.Content maxWidth="450px">
    <Dialog.Title>Assistant IA</Dialog.Title>
    <button 
      onClick={() => setShowModal(false)} 
      className="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-200"
    >
      <X size={20} /> 
    </button>

    <Inset side="x" mb="4">
      <Separator size="4" />
    </Inset>

    <Chat />
  </Dialog.Content>
</Dialog.Root>

    </div>
    
  );
}

export default CreationEditor;
