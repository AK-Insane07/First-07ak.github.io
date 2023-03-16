#include<iostream>
using namespace std;
class base1{
    public:
    void greet(){
        cout<<"HOW ARE YOU"<<endl;

    }
};
class base2{
    public:
    void greet(){
        cout<<"kya haall hai bhai ke"<<endl;

    }
};
class derived:public base1,public base2{
 int a;
 public:
 void greet(){
    base2::greet();
 }
};
int main(){
base1 baseobj1;
base2 baseobj2;
baseobj1.greet();
baseobj2.greet();

derived d;
d.greet(); 
 
return 0;
}