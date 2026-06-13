def isPresent(n, nums, t):
    #write your code here

    low = 0
    high = n-1

    while high>=low:
        mid = (low+high)//2

        if nums[mid]==t:
            return mid

        if nums[mid]>t:
            low = mid+1
        else:
            high = mid-1

    return -1