def FindSqrt(x):
    # Complete the code here
    s, e = 1, x
    ans = -1
    while(s<=e):
        mid = s+(e-s)//2
        if(mid*mid <= x):
            ans = mid
            s = mid+1
        else:
            e = mid-1
    return ans