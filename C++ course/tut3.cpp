#include<iostream>
using namespace std;

 class Empo {
    
    public:
      string name;
      string branch;
      int rollno;
      void teacher();
 };
 void Student::teacher(void)
 {
    string uup="gsgd";
    int id= 8;
       cout<<"Student name "<<uup<<endl;
       cout<<"Student name "<<id<<endl;
 }
int main (){
    

    Student s1;
    s1.name = "Arsh";
    s1.branch = "CS";
    s1.rollno = 9;
    s1.teacher();
     
     cout<<"Student name "<<s1.name<<endl;
      cout<<"Student name "<<s1.branch<<endl;
       cout<<"Student name "<<s1.rollno<<endl;

     return 0;


}
        