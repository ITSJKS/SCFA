def FindSqrt(x):

    if x<2:
        return x

    low =1
    high = x

    while low <= high:
        
        mid = (low+high)//2

        if (mid * mid) == x:
            return mid

        elif (mid * mid) < x:
            low = mid + 1

        elif (mid * mid) > x:
            high = mid - 1
    return high