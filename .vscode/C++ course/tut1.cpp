#include<iostream>
using namespace std;
class Box{
private:
double length;
double breadth;
double heigth;
public:
void setlength(double l){
    length=l;
}
void setbreadth(double b){
    breadth=b;
}
void setheigth(double h){
    heigth=h;
}
double getvolume(){
    return length*breadth*heigth;
}
Box operator+(const Box &b){
    Box bb;
    bb.length=this->length+b.length;
    bb.breadth=this->breadth+b.breadth;
    bb.heigth=this->heigth+b.heigth;
    return bb;
}
};
int main(){
Box b1;
Box b2;
Box b3;
double volume=0.0;
b1.setlength(6.0);
b1.setbreadth(7.0);
b1.setheigth(5.0);

b2.setlength(12.0);
b2.setbreadth(13.0);
b2.setheigth(10.0);

volume=b1.getvolume();
cout<<"Volume of box 1 is "<<volume<<endl;

volume=b2.getvolume();
cout<<"Volume of box 2 is "<<volume<<endl;

b3=b1+b2;
volume=b3.getvolume();
cout<<"Volume of box 3 is "<<volume<<endl;
return 0;
}