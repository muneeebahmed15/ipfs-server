const asyncHandler = require ("express-async-handler");
const Contact = require ("../models/contactModel");

// @desc get all contacts
// @route GET /api/contacts
// @access private

const getContacts = asyncHandler(async(req,res) => {
    const contacts = await Contact.find({user_id : req.user.id});
    res.status(200).json(contacts);
});

// @desc Create new contact
// @route POST /api/contact
// @access private

const createContact = asyncHandler(async(req,res) => {
    console.log("the request body is ", req.body)
    const {name, email, phone}= req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const contact = await Contact.create({
        name,email,phone,user_id : req.user.id
    })
    res.status(201).json(contact);
})

// @desc Get contact
// @route GET /api/contact/:id
// @access private

const getContact = asyncHandler( async(req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not Found");
    }
    res.status(200).json(contact);
})

// @desc Update contact
// @route PUT /api/contact/:id
// @access private

const updteContact = asyncHandler( async(req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not Found");
    }

     if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error ("user don't have permission to update other contancts");
     }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    );

    res.status(200).json(updatedContact);
})


// @desc Delete contact
// @route DELETE /api/contact/:id
// @access private

const deleteContact = asyncHandler( async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not Found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error ("user don't have permission to remove other contancts");
     }

    await Contact.deteteOne({_id : req.params.id});

    res.status(200).json(contact);
});

module.exports = {getContacts, createContact, getContact, updteContact, deleteContact}