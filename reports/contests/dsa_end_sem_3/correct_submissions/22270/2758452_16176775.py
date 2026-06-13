def isPresent(n, nums, target):
    #write your code here
    low=0
    high=n-1
    while low<=high:
        mid=(low+high)//2
        if nums[mid]==target:
            return mid

        if nums[mid]<target:
            high=mid-1
        else:
            low=mid+1
    return -1