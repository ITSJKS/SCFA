def FindSqrt(x):
    if x < 2:
        return x
    left, right = 1, x//2
    while left<=right:
        mid = (left+right)//2
        square = mid *mid
        if square  == x:
            return mid
        elif square < x:
            left = mid+1
        else:
            right = mid-1
    return right
    # s = 0
    # e = len(x)-1
    # while (s<=e):
    #     mid = (s+e)//2
    #     if mid[x] == x:
    #         return mid
    #     elif mid[x] > x:
    #         mid = x +1
    #     else:
    #         mid = x -1
    # return x