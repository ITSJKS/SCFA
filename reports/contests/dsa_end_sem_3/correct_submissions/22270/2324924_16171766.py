def isPresent(n, nums, target):
    min=0
    max=n-1
    while min<=max:
        mid=(min+max)//2
        if nums[mid]==target:
            return mid
        elif nums[mid]>target:
            min=mid+1
        else:
            max=mid-1
    return -1