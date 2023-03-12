class Library:
    def __init__(self,listofBooks):
        self.books=listofBooks
    def displayAvailableBooks(self):
        print("The books present in this libraray are: ")
        for book in self.books :
                print("--"+book)
    def borrowBook(self,bookName):
        if bookName in self.books:
            print(f"Book has been issued by you :-{bookName}. Keep is safe and you have to return  this book in 30 days")            
            self.books.remove(bookName)
        else:
            print("Sorry, book has nbeen alredy issued")    
    def returnBook(self,bookName):
        self.books.append(bookName)      
        print("thanks for returning the book, wish you have a good day ahead! ")

class student():
    def requestBook(self):
        self.books=input("Enter the name of the book you want to Borrow: ")
        return self.books
    def returnBook(self):
        self.books=input("Enter the name of the book you want to Return: ")
        return self.books

if __name__=="__main__":

    centralLibrary=Library(["Algoritms and DSA", "Django","web dev","Do epic shits","Python dev","Dev Ops","SDE journey"])
    # centralLibrary.displayAvailableBooks()
    Student=student()
    while(True):
        welcomemsg='''
        =====WELCOME TO THE CENTRAL LIBRARY
        PRESS BELOW NO. TO PERFORM TASKS:
        1.LIST ALL BOOKS
        2.REQUEST A BOOK
        3.RETURN & ADD A BOOK
        4.EXIT THE LIBRARAY
        '''
        print(welcomemsg)
        a=int(input("enter your choice: "))
        if a==1:
            centralLibrary.displayAvailableBooks()  
        elif a==2:
            centralLibrary.borrowBook(Student.requestBook())
        elif a==3:
            centralLibrary.returnBook(Student.returnBook())
        elif a==4:
            print("Thanks for using our Library!!")
            exit()
        try:
            if a!=1 or a!=2 or a!=3 or a!=4:
                print("you have entered wrong option")        
        except Exception as e:
            print("TRY again and enter correct option again")       
        else:
            print("Kindly chosse valid option")
        