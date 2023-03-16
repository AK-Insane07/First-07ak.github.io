//implementation of array with object

#include <iostream>
using namespace std;

class Employee
{
    int id;
    int salary;

public:
  void salary();
  void atad();
  void oops();
  void job();
    void setId(void)
    {
        
        cout << "Enter the id of employee" << endl;
        cin >> id;
    
    }

    void getId(void)
    {
        cout << "The id of this employee is " << id << endl;
    }
};
void Employee::salary(){
     
    cout<<" enter yourssallry is "<<salary <<endl;

}
void Employee::job(){
     
    cout<<" enter yourssallry is "<<salary <<endl;

}
void Employee::opps(){
     
    cout<<" enter yourssallry is "<<salary<<endl;

}
void Employee::atad(){
     
    cout<<" enter yourssallry is " <<salary<<endl;

}

int main()
{
  
    Employee fb;
        fb.setId();
        fb.getId();
        fb.salary();
        fb.atad();
        fb.job();
        fb.oops();



    return 0;
}
