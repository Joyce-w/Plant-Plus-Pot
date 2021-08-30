"use strict";

const db = require("../db");
const { BadRequestError, ExpressError, NotFoundError } = require("../ExpressError");

/**Class that handles  */
class PlantList {

    /**Create a list of plants for a user with a list title, user, and the plant_list_id*/
    //id does not fill in automatically into db
    static async create(title, user) {
        //check if there is a similar list by the same user
        const checkDupe = await db.query(`
            SELECT list_name, user_id
            FROM user_lists
            WHERE user_id =$1 AND
            list_name=$2;
        `,[user, title])

        //throw error if there is duplicate title with same user
        if (checkDupe.rows[0]) throw new BadRequestError('Duplicate list name');
        
        //add new list to db
        let newList = await db.query(`
            INSERT INTO user_lists
            (list_name, user_id)
            VALUES ($1, $2)
            RETURNING user_id, list_name;
        `, [title, user])
        return newList.rows;
    }

    /**Gets a list based off the id (or username?)
     * Additional Implementations**
    */
    static async getPlantList() {
        const lists = await db.query(`
            SELECT ul.list_name, u.username
            FROM user_lists ul
            JOIN users u ON u.id = ul.user_id
            GROUP BY ul.list_name, u.username;
        `);

        return lists.rows
    }

    /**Gets a single list based off list id */
    static async getList(list_id) {

        console.log('id is here', list_id);

        const listRes = await db.query(`
            SELECT ul.id, ul.list_name, u.username
            FROM user_lists ul
            JOIN users u ON u.id = ul.user_id
            WHERE ul.id=$1
            GROUP BY  ul.id, ul.list_name,u.username;
        `, [list_id])

        const plants = await db.query(`
            SELECT pl.plant_id, p.plant_name FROM user_lists ul
            JOIN plant_list pl ON pl.user_list_id = ul.user_id
            JOIN plants p ON pl.plant_id = p.id
            WHERE ul.id = $1;
        `,[list_id])

        const {id, list_name, username} = listRes.rows[0];
        const plants_list = plants.rows.map(p => ({
            plant_id: p.plant_id,
            plant_name: p.plant_name
                
        }))
        return ({id, list_name, username, plants_list})

    }



    // /**Edit list name if it is own user*/
    // static async updateListName(user_id)

    // /**Delete the plant list if it is own user */
    // static async deletePlantList(user_id)
    
    // /**Add plant to plant_list */
    // static async addPlantToList(list_id, plant_id)

    // static async removePlantFromList(list_id, plant_id)

}


module.exports = PlantList;
