def FindSqrt(x):
    ans = 1 
    s=1
    e=x
    while(s<=e):
        mid = (s+e)//2 
        if mid * mid == x:
            ans=mid 
            return ans 
        elif mid * mid > x:
            
            e=mid-1
        else:
            ans=mid 
            s=mid+1
    return ans