def FindSqrt(x):
    if x==0 or x==1:
        return x
    low = 1
    high = x
    ans = 0
    while low<=high:
        mid = (low+high)//2
        if mid*mid ==x:
            return mid 
        if mid*mid < x:
            ans = mid 
            low = mid+1
        else:
            high = mid-1
    return ans