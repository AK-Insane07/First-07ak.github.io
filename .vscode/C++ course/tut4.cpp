#include<iostream>
using namespace std;
class shope{
      public:
      string name;
      int price;
      int id;
      void person();
};
void shope :: person(void)
{
    cout<<"thank you for shoping"<<endl;
    
}

int main (){


    shope s1;
    s1.name = "cake";
    s1.price = 200;
    s1.id = 1;
    cout<<"shope item no.:"<<s1.id <<"."<<"name of item :"<<s1.name<<"price of item ="<<s1.price<<endl;
s1.person();
   return 0;
}










