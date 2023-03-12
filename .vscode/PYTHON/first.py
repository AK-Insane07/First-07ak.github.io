class calculator:
    def __init__(self,num) :
       self.number=num
    def square(self) :
        print(f"the value of your given nummber {self.number} and square is {self.number **2}")
    
    def squareRoot(self) :
        print(f"the value of your given nummber {self.number} and squareRoot is {self.number **0.5}")
    
    def cube(self) :
        print(f"the value of your given nummber {self.number} and CUBE is {self.number **3}")
        
    @staticmethod    
    def greet() :
        print("*******  WELCOME TO THE CALCULATOR *******")          
o1=calculator(9)   
o1.greet()            
o1.square()
o1.squareRoot()
o1.cube()