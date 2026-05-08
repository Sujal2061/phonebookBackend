const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb://sujalkoirala404_db_user:${password}@ac-8mergjl-shard-00-00.jgjrnr1.mongodb.net:27017,ac-8mergjl-shard-00-01.jgjrnr1.mongodb.net:27017,ac-8mergjl-shard-00-02.jgjrnr1.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-hjkvgq-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, {family:4})


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[3]
const number = process.argv[4]

if (name && number) {
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(result=>{
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('phonebook:')
    Person.find({}).then(persons=>{
        persons.forEach(person=>
            console.log(`${person.name} ${person.number}`)
        )
        mongoose.connection.close()
    })
}
