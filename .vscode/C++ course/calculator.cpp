#include <iostream>
#include <cmath>
using namespace std;
class Base1
{
protected:
  int num1, num2;

public:
  void setdata1()
  {
    cout << "enter your first number:-" << endl;
    cin >> num1;
    cout << "enter your second number:-" << endl;
    cin >> num2;
  }
  void simpleCalculator()
  {
    char ch;
    while (1)
    {
      cout << "MENU:--" << endl;
      cout << "1.press + for addition" << endl
           << "2.press - for subtraction" << endl
           << "3.press * for multiplication" << endl
           << "4.press / for division" << endl
           << "5.press ^ for power" << endl
           << "6.press %  for remainder" << endl
           << "7.press 00 for exit" << endl;
      cin >> ch;
      switch (ch)
      {
      case '+':
        setdata1();
        cout << num1 + num2 << endl;
        break;
      case '-':
        setdata1();
        cout << num1 - num2 << endl;
        break;
      case '*':
        setdata1();
        cout << num1 * num2 << endl;
        break;
      case '/':
        setdata1();
        cout << num1 / num2 << endl;
        break;
      case '^':
        setdata1();
        cout << pow(num1, num2) << endl;
        break;
      case '%':
        setdata1();
        cout << num1 % num2 << endl;
        break;
      case '0':
        goto exit;
        break;
      default:
        cout << "invalind character!!!" << endl;
      }
    }
  exit:;
  }
};
class Base2
{
protected:
  int n;

public:
  void setdata2()
  {
    cout << "enter your number" << endl;
    cin >> n;
  }
  void scientificClaculator()
  {
    int ap;
    while (1)
    {
      cout << "menu:--" << endl;
      cout << "press 1 for square root" << endl
           << "press 2 for sin angle" << endl
           << "press 3 for cos angle " << endl
           << "press 4 for tan" << endl
           << "press 5 for cot angle" << endl
           << "press 6 for sec angle" << endl
           << "press 7 for cosec angle" << endl
           << "press 8 for LOGORITHM" << endl
           << "press 9 for exit" << endl;
      cin >> ap;
      switch (ap)
      {
      case 1:
        setdata2();
        cout << sqrt(n) << endl;
        break;
      case 2:
        setdata2();
        cout << sin(n * 180 / 3.14) << endl;
        break;
      case 3:
        setdata2();
        cout << cos(n * 180 / 3.14) << endl;
        break;
      case 4:
        setdata2();
        cout << tan(n * 180 / 3.14) << endl;
        break;
      case 5:
        setdata2();
        cout << 1 / tan(n * 180 / 3.14) << endl;
        break;
      case 6:
        setdata2();
        cout << 1 / cos(n * 180 / 3.14) << endl;
        break;
      case 7:
        setdata2();
        cout << 1 / sin(n * 180 / 3.14) << endl;
        break;
      case 8:
        setdata2();
        cout << log(n) << endl;
        break;
      case 9:
        goto exit;
        break;
      default:
        cout << "invalid inputs!!!!" << endl;
      }
    }
  exit:;
  }
};

class derived : public Base1, public Base2
{
public:
  void show()
  {
    while (1)
    {
      char chr;
      cout << "Enter @ for menu of Simple Calculator or # for menu of Scientific Calculator or & for exit" << endl;
      cin >> chr;
      switch (chr)
      {
      case '@':
        simpleCalculator();
        break;
        
      case '#':
        scientificClaculator();
        break;
      case '&':
      {
        goto exit;
        break;
      default:
        cout << "Invalid character Entered" << endl;
      }
      }
    exit:;
    }
  }
};

int main()
{
  cout << "WELCOME TO THE PROGRAM CALC ;)" << endl;
  derived der;
  der.show();

  return 0;
}