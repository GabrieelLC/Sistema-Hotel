export const getAllItems = (req, res) => {

    res.send('Get all items');
};

export const getItemById = (req, res) => {
    const { id } = req.params;

    res.send(`Get item with ID: ${id}`);
};

export const createItem = (req, res) => {
    const newItem = req.body;
    // Logic to create a new item
    res.status(201).send('Item created');
};

export const updateItem = (req, res) => {
    const { id } = req.params;
    const updatedItem = req.body;
    // Logic to update an item
    res.send(`Item with ID: ${id} updated`);
};

export const deleteItem = (req, res) => {
    const { id } = req.params;
    // Logic to delete an item
    res.send(`Item with ID: ${id} deleted`);
};