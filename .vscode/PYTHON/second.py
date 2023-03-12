class train:
    def __init__(self, name ,  fare , seats) :
        self.name=name
        self.fare=fare
        self.seats=seats
    def printdata(self):
        print(f'''the NAME of the train is {self.name} \n the fare charges is rs.{self.fare} and the available seats are {self.seats}''')
        print(f"thank you to visit us--->->->->-->->")  
    def bookticket(self):
        if(self.seats>0):
            print(f"your ticket has been confirmed and your seats no. is {self.seats}")
            self.seats=self.seats-1  
        else:
            print("seats has been fulled !!! try in a tatkal")
    def availableseats(self):
        print(f"available seats are now is {self.seats}" )            
intercity=train("RAJDHANI -- 29177", 1600, 34)        
intercity.printdata()
intercity.bookticket()
intercity.bookticket()
intercity.bookticket()
intercity.availableseats()
    