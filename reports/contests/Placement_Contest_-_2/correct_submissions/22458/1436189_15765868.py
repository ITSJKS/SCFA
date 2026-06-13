# import math

def FindSqrt(x):
    # Complete the code here

    if x==0 or x==1:
        return x
    
    def condition(mid):
        return mid*mid>x
    
    l=2
    r=x

    while l<r:
        mid=(l+r)//2
        if(condition(mid)):
            r=mid
        else:
            l=mid+1
    
    return l-1

    # l=0
    # r=x+1

    # def condition(x):
    #     return mid*mid>x
    
    # while l<r:
    #     mid=(l+r)//2
    #     if(condition(mid)):
    #         r=mid
    #     else:
    #         l=mid+1
    
    # return l
    






    # x=math.sqrt(x)
    # return math.floor(x)