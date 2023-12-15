import { Request, Response } from "express";
import { Citi, Crud } from "../global";

class UserController implements Crud {
  constructor(private readonly citi = new Citi("User")) {}
  create = async (request: Request, response: Response) => {
    const { firstName, lastName, age } = request.body;

    const isAnyUndefined = this.citi.areValuesUndefined(
      firstName,
      lastName,
      age
    );
    if (isAnyUndefined) return response.status(400).send();

    const newUser = { firstName, lastName, age };
    const { httpStatus, message } = await this.citi.insertIntoDatabase(newUser);

    return response.status(httpStatus).send({ message });
  };

  get = async (request: Request, response: Response) => {
    const { httpStatus, values } = await this.citi.getAll();

    return response.status(httpStatus).send(values);
  };

   // função que filtra usuários com idade inferior à idade fornecida no get
   getById = async (request: Request, response: Response) => {
    const { age } = request.params;
    const { httpStatus, values } = await this.citi.getAll();

    const valueToReturn = values.filter(value => value.age < Number(age));

    if (valueToReturn.length === 0) return response.status(httpStatus).send('Não há pessoas usuárias para o filtro escolhido');

    return response.status(httpStatus).send(valueToReturn);
  };

  // função que calcula e retorna a média de idade dos usuários
  averageAge = async (request: Request, response: Response) => {
    const { httpStatus, values } = await this.citi.getAll();

    const ageSum = values.reduce((accumulate, value) => {
      return accumulate + value.age
    }, 0);

    const numberOfPeople = values.length

    const average = ageSum / numberOfPeople;

    return response.status(httpStatus).send({ averageAge: average });
  };

  // Funcao que determina o numero de usuarios idosos no banco de dados
  OlderUsers = async (request:Request, response: Response) => {
    const {age} = request.params;
    const {httpStatus, values} = await this.citi.getAll();

    const OldPeople = values.filter(value => value.age >= 65)
    if(OldPeople.length === 0) return response.status(httpStatus).send("Não há usuários idosos no banco de dados.");

    return response.status(httpStatus).send(`Existem ${OldPeople.length} idosos no banco de dados`)
  }

  // Essa funcao retorna o numero de pessoas que possuem o mesmo nome
  SameNamePeople =async (request: Request, response: Response) => {
    const {name} = request.params;
    const {httpStatus, values} = await this.citi.getAll();
    
    const namesFilter = values.filter(value => value.firstName === name);
    
    if(namesFilter.length === 0) return response.status(httpStatus).send("Não existem pessoas com esse nome no banco de dados.");
    else if(namesFilter.length === 0) return response.status(httpStatus).send("Existe apenas 1 pessoa com esse nome no banco de dados.");
    return response.status(httpStatus).send(`Existem ${namesFilter.length} pessoas com esse nome no banco de dados`);
  }  

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    const { httpStatus, messageFromDelete } = await this.citi.deleteValue(id);

    return response.status(httpStatus).send({ messageFromDelete });
  };

  update = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { firstName, lastName, age } = request.body;

    const updatedValues = { firstName, lastName, age };

    const { httpStatus, messageFromUpdate } = await this.citi.updateValue(
      id,
      updatedValues
    );

    return response.status(httpStatus).send({ messageFromUpdate });
  };
}

export default new UserController();
