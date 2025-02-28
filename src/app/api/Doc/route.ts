// import Doc from "@/models/Course";
// import connect from "@/utils/db";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// export async function POST(request: any) {
//   const { email,password } = await request.json();
//   await connect();
//   await Doc.create({ email ,password});
//    &

// }

// async function ajouterElementDansDoc(nouvelElement:any,email:any,docNodeTitle:any) {
//   const existingDoc = await Doc.findOne({ docNodeTitle,email });
//     if (existingDoc) {

//       existingDoc.courses.push(nouvelElement);

//     }
//   try {
//     const docInstance = new Doc({
//       title: docNodeTitle,
//       authorEmail: email,
//       courses: [nouvelElement]
//     });

//     const savedDoc = await docInstance.save();
//     console.log("Nouvel élément ajouté avec succès :", savedDoc);
//   } catch (error) {
//     console.error("Une erreur s'est produite lors de l'ajout de l'élément :", error);
//   }
// }

// async function getDocByTitleAndAuthor(title:any, email:any) {
//   try {
//     const doc = await Doc.findOne({ title, authorEmail: email });
//     if (doc) {

//       return doc;
//     } else {

//       return null;
//     }
//   } catch (error) {
//     console.error("Une erreur s'est produite lors de la recherche du document :", error);
//     return null;
//   }
// }

//----------------

export async function POST(request: any) {
  try {
    // Parse the request body
    const { filename, emptyTOC, email } = await request.json();
    console.log(
      "----------------------------------------------------------------"
    );
    console.log(emptyTOC);
    // Validate required fields
    if (!emptyTOC || !email || !filename) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const documents = await prisma.document.findMany({
      where: {
        email: email,
      },
    });
    const existingDocument = documents.find((doc) => doc.title === filename);

    if (existingDocument) {
      // Update the existing document
      const updatedDocument = await prisma.document.update({
        where: {
          id: existingDocument.id,
        },
        data: {
          courses: {
            emptyTOC,
          },
        },
      });
      console.log("Document updated successfully:", existingDocument);
    } else {
      // Create a new document
      const newDocument = await prisma.document.create({
        data: {
          title: filename, // Use the filename as the title of the document
          email: email, // Set the email of the author
          // courses: {
          //   create: emptyTOC.map((tocItem: any) => ({
          //     htmlContent: tocItem.htmlContent,
          //     isClicked: tocItem.isClicked,
          //     isEnterPressed: tocItem.isEnterPressed,
          //     nodeLevel: tocItem.nodeLevel,
          //     nodeTitle: tocItem.nodeTitle,
          //     nodeType: tocItem.nodeType,
          //     parent: tocItem.parent,
          //   })),
          // },
          // 3c. Create the courses array with the sorted TOC
          courses: {
            create: emptyTOC,
          },
        },
      });

      console.log("Document added successfully:", newDocument);
    }

    // Send a successful response
    return NextResponse.json(
      { message: "Document added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("An error occurred while adding the document:", error);

    // Send an error response
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

async function updateDocument(
  email: string,
  filename: string,
  updatedData: Partial<Document>
) {
  try {
    const document = await prisma.document.updateMany({
      where: {
        email: email,
        title: filename,
      },
      data: updatedData,
    });
    console.log("Document updated successfully:", document);
    return document;
  } catch (error) {
    console.error("An error occurred while updating the document:", error);
    throw error;
  }
}

async function getDocumentsByAuthor(email: string) {
  try {
    const documents = await prisma.document.findMany({
      where: {
        email: email,
      },
    });
    console.log("Documents retrieved successfully:", documents);
    return documents;
  } catch (error) {
    console.error("An error occurred while retrieving the documents:", error);
    throw error;
  }
}

async function getDocumentByAuthorAndTitle(email: string, filename: string) {
  try {
    const documents = await prisma.document.findMany({
      where: {
        email: email,
      },
    });

    const document = documents.find((doc) => doc.title === filename);

    if (document) {
      console.log("Document retrieved successfully:", document);
      return document;
    } else {
      console.log("Document not found.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving the document:", error);
    throw error;
  }
}

async function deleteDocument(email: string, filename: string) {
  try {
    const document = await prisma.document.deleteMany({
      where: {
        email: email,
        title: filename,
      },
    });
    console.log("Document deleted successfully:", document);
    return document;
  } catch (error) {
    console.error("An error occurred while deleting the document:", error);
    throw error;
  }
}

export {
  updateDocument,
  getDocumentsByAuthor,
  getDocumentByAuthorAndTitle,
  deleteDocument,
};
