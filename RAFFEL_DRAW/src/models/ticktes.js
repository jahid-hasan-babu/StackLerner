const Ticket = require('./Ticket')
const {readFile, writefile} = require('../routes/utils')

//for secure
const tickets = Symbol('ticktes')

class ticketsCollection {
    constructor(){
        //IFFE
        (async function(){
            this[tickets] = await readFile()
        }.call(this))
    }
    /**
     * create and save new ticket
     * @param {string} username 
     * @param {number} price 
     * @returns {Ticket}
     */
    create(username, price) {
        const ticket = new Ticket(username, price)
        this[tickets].push(ticket)
        writefile(this[tickets])
        return ticket
    }
    /**
     * create bulk ticktes
     * @param {string} username 
     * @param {number} price 
     * @param {number} quantity 
     * @param {Ticket[]}
     */
    createBluk(username,price,quantity){
        const result = []
        for(let i = 0; i < quantity; i++){
            const ticket = this.create(username, price)
            result.push(ticket)
        }
        writefile(this[tickets])
        return result;
    }
    /**
     * return all ticket
     */
    find(){
        return this[tickets]
    }
    /**
     * find single ticket by id
     * @param {string} id
     * @param {Ticket}
     */
    findById(id){
        const ticket = this[tickets].find(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.id == id
        )
        return ticket;
    }
    /**
     * find  tickets by username
     * @param {string} username
     * @param {Ticket[]}
     */
    findByUsername(username){
        const userTickets = this[tickets].filter(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.username === username
        )
        return userTickets;
    }
    /**
     * update by id
     * @param {string} ticketId
     * @param {{username:string,price:number}} ticketBody
     */
    updateById(ticketId, ticketBody){
        const ticket = this.findById(ticketId)
        if(ticket){
            ticket.username = ticketBody.username ?? ticket.username
            ticket.price = ticketBody.price ?? ticket.price
        }
        writefile(this[tickets])
        return ticket
    }
    /**
     * updateBulk
     * @param {string} username 
     * @param {{username:string,price:number}} ticketBody 
     * @param {Ticket[]}
     */
    updateBulk(username,ticketBody){
        const userTickets = this.findByUsername(username)
        const updatedTickets = userTickets.map(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => this.updatedById(ticket.id, ticketBody)
        )
        writefile(this[tickets])
        return updatedTickets

    }
    /**
     * 
     * @param {string} ticketId
     *  @param {boolean}
     */
    deleteById(ticketId){
        const index = this[tickets].findIndex(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.id == ticketId
        )
        if(index == - 1){
            return false
        }else{
            this[tickets].splice(index,1)
            writefile(this[tickets])
            return true
        }

    }
    /**
     * 
     * @param {*} username 
     * @param {boolean[]}
     */
    deleteBulk(username){
        const userTickets = this.findByUsername(username)
        const deleteResult = userTickets.map(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => {this.deleteById(ticket.id)}
        )
        writefile(this[tickets])
        return deleteResult
    }
    /**
     * winner ticket
     * @param {number} winnerCount 
     * @parm {Ticket[]}
     */
    draw(winnerCount){
        const winnerIndexes = new Array(winnerCount)
        let winnerIndex = 0;
        while(winnerIndex < winnerCount){
            let ticketIndex = Math.floor(Math.random() * this[tickets].length)
            if(!winnerIndexes.includes(ticketIndex)){
                winnerIndexes[winnerIndex++] = ticketIndex
                continue
            }
        }
        const winners = winnerIndex.map(
            /**
             * @param {number} index
             */
            (index) => this[tickets][index]
        )
        return winners
    }
   
}





const ticketCollection = new ticketsCollection()
module.exports = ticketCollection