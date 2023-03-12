
// 5 Exception handling
import java.io.*;
public class ExceptTest {
    public static void main(String args[]) {
 try{
     int a[]=new int[2];
     System.out.println("Access element three: "+a[3]);
 }
       catch(ArrayIndexOutofBoundsException e){
           System.out.println("Exception thrown :"+e);
           
       }
       System.out.println("Out of the Block");
    }
}


// 6 show inhertance

class Calculation  {
    int z;
    public void addition(int x,int y){
        z=x+y;
        System.out.println("The sum of numbers: "+z);
        }
         public void Subtraction(int x,int y){
        z=x-y;
        System.out.println("Difference between the given numbers: "+z);
        }
         public class My_Calculation extends Calculation{
              public void multiplication(int x,int y){
        z=x*y;
        System.out.println("The product of numbers: "+z);
        }
         }
   public static void main(String args[]) {
   int a=20,b=20;
   My_Calculation d=new My_Calculation();
   d.addition(a,b);
   d.Subtraction(a,b);
   d.multiplication(a,b);
   
     
   }
}


//





