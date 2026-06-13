def isPresent(n, nums, target):
    i = 0
    j = n-1
    while i<=j:
        mid = (i+j)//2
        if nums[mid]==target:
            return mid
        elif nums[mid]>target:
            i = mid+1
        else:
            j = mid-1
    return -1