def FindSqrt(x):
    first = 1
    last = x//2+1
    while first<=last:
        mid = (first+last)//2
        if mid*mid <=x:
            first=mid+1
        else:
            last = mid-1
    return first-1